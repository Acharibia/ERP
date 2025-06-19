<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Support\DataTables\AbstractDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use ReflectionClass;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class DataTableController extends Controller
{
    /**
     * Process a DataTable request.
     *
     * @param Request $request
     * @param string $dataTable The DataTable class name
     * @return \Illuminate\Http\JsonResponse
     */
    public function process(Request $request, string $dataTable)
    {
        // Resolve the DataTable class
        $instance = $this->resolveDataTable($dataTable);

        // Process the request and return response
        $data = $instance->process($request);

        return response()->json($data);
    }

    /**
     * Get the filter options for a DataTable.
     *
     * @param string $dataTable The DataTable class name
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilterOptions(string $dataTable)
    {
        // Resolve the DataTable class
        $instance = $this->resolveDataTable($dataTable);

        return response()->json([
            'filterOptions' => $instance->filterOptions(),
        ]);
    }

    /**
     * Resolve a DataTable class name to an instance.
     *
     * @param string $dataTable The DataTable class name
     * @return AbstractDataTable
     * @throws \Exception If the DataTable class cannot be found or instantiated
     */
    protected function resolveDataTable(string $dataTable): AbstractDataTable
    {
        // Format class name if it doesn't include namespace
        if (!Str::contains($dataTable, '\\')) {
            // Attempt to resolve from multiple possible namespaces
            $possibleNamespaces = [
                "App\\DataTables\\{$dataTable}",
                "App\\Admins\\DataTables\\{$dataTable}",
                "App\\Reseller\\DataTables\\{$dataTable}",
                "App\\Business\\DataTables\\{$dataTable}",
                "App\\Tenant\\Modules\\HR\\DataTables\\{$dataTable}",
            ];

            foreach ($possibleNamespaces as $fullyQualifiedClassName) {
                if (class_exists($fullyQualifiedClassName)) {
                    $dataTable = $fullyQualifiedClassName;
                    break;
                }
            }
        }

        // Check if the class exists
        if (!class_exists($dataTable)) {
            throw new \Exception("DataTable class not found: {$dataTable}");
        }

        // Check if the class is a valid DataTable
        $reflection = new ReflectionClass($dataTable);
        if (!$reflection->isSubclassOf(AbstractDataTable::class)) {
            throw new \Exception("Class is not a valid DataTable: {$dataTable}");
        }

        // Instantiate and return the DataTable
        return app($dataTable);
    }



    /**
     * Export data from a DataTable.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Symfony\Component\HttpFoundation\StreamedResponse|\Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request)
    {
        $format = $request->input('format', 'csv');
        $className = $request->input('class');

        $dataTable = $this->resolveDataTable($className);

        // Get base query
        $query = $dataTable->query();

        // Apply filters
        $filters = json_decode($request->input('filters', '{}'), true);
        if (!empty($filters)) {
            foreach ($filters as $column => $value) {
                if (empty($value))
                    continue;

                if (str_contains($column, '.')) {
                    // Handle relationship columns
                    list($relation, $field) = explode('.', $column, 2);
                    $query->whereHas($relation, function ($q) use ($field, $value) {
                        if (is_array($value)) {
                            $q->whereIn($field, $value);
                        } else {
                            $q->where($field, 'like', "%{$value}%");
                        }
                    });
                } else {
                    // Handle regular columns
                    if (is_array($value)) {
                        $query->whereIn($column, $value);
                    } else {
                        $query->where($column, 'like', "%{$value}%");
                    }
                }
            }
        }

        // Apply global search
        $globalFilter = $request->input('globalFilter');
        if ($globalFilter) {
            $columns = $dataTable->getColumns();
            $query->where(function ($q) use ($columns, $globalFilter) {
                foreach ($columns as $key => $column) {
                    if ($column['searchable'] ?? true) {
                        $name = $column['data'] ?? $key;

                        if (str_contains($name, '.')) {
                            // Handle relationship columns
                            list($relation, $field) = explode('.', $name, 2);
                            $q->orWhereHas($relation, function ($subQ) use ($field, $globalFilter) {
                                $subQ->where($field, 'like', "%{$globalFilter}%");
                            });
                        } else {
                            $q->orWhere($name, 'like', "%{$globalFilter}%");
                        }
                    }
                }
            });
        }

        // Apply sorting
        $sort = json_decode($request->input('sort', '[]'), true);
        if (!empty($sort)) {
            foreach ($sort as $sortItem) {
                if (isset($sortItem['id']) && isset($sortItem['desc'])) {
                    $column = $sortItem['id'];
                    $direction = $sortItem['desc'] ? 'desc' : 'asc';
                    $query->orderBy($column, $direction);
                }
            }
        }

        // Get data
        $items = $query->get();

        // Get visible columns
        $visibleColumns = json_decode($request->input('columns', '[]'), true);

        // Transform data - create a more export-friendly format
        $exportData = $this->prepareExportData($dataTable, $items, $visibleColumns);

        // Generate the appropriate export format
        switch ($format) {
            case 'csv':
                return $this->exportAsCsv($exportData, $dataTable->name() . 's');
            case 'excel':
                return $this->exportAsExcel($exportData, $dataTable->name() . 's');
            case 'pdf':
                return $this->exportAsPdf($exportData, $dataTable->name() . 's');
            default:
                return response()->json(['error' => 'Unsupported export format'], 400);
        }
    }

    /**
     * Prepare data for export.
     *
     * @param mixed $dataTable
     * @param \Illuminate\Support\Collection $items
     * @param array $visibleColumns
     * @return array
     */
    private function prepareExportData($dataTable, $items, array $visibleColumns)
    {
        $columns = $dataTable->getColumns();
        $result = [];

        // Prepare headers (only for visible and exportable columns)
        $headers = [];
        foreach ($columns as $key => $column) {
            $name = $column['data'] ?? $key;
            $exportable = $column['exportable'] ?? true;

            if (in_array($name, $visibleColumns) && $exportable) {
                $headers[] = $column['title'] ?? Str::title(str_replace('_', ' ', $name));
            }
        }
        $result[] = $headers;

        // Prepare data rows
        foreach ($items as $item) {
            $row = [];
            foreach ($columns as $key => $column) {
                $name = $column['data'] ?? $key;
                $exportable = $column['exportable'] ?? true;

                // Only include visible and exportable columns
                if (in_array($name, $visibleColumns) && $exportable) {
                    // Check if there's a formatter defined
                    if (method_exists($dataTable, 'format' . Str::studly($name) . 'Column')) {
                        $value = $dataTable->{'format' . Str::studly($name) . 'Column'}($item);
                    } else {
                        // Handle nested attributes
                        if (str_contains($name, '.')) {
                            $value = data_get($item, $name);
                        } else {
                            $value = $item->{$name} ?? null;

                            // Handle date columns
                            if (($column['type'] ?? '') === 'date' && !empty($value)) {
                                $format = $column['dateFormat'] ?? 'Y-m-d H:i';
                                $value = \Carbon\Carbon::parse($value)->format($format);
                            }
                        }
                    }

                    // Handle badge columns - remove any HTML markup
                    if (($column['type'] ?? '') === 'badge') {
                        $value = strip_tags($value);
                    }

                    // Handle action columns - we probably don't want to export these
                    if (($column['type'] ?? '') === 'actions') {
                        $value = '';
                    }

                    $row[] = $value;
                }
            }
            $result[] = $row;
        }

        return $result;
    }

    /**
     * Export data as CSV.
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    private function exportAsCsv(array $data, string $filename)
    {
        $filename = $filename . '-' . date('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($data) {
            $output = fopen('php://output', 'w');
            foreach ($data as $row) {
                fputcsv($output, $row);
            }
            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Export data as Excel.
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    private function exportAsExcel(array $data, string $filename)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Add data to the sheet
        foreach ($data as $rowIndex => $row) {
            foreach ($row as $columnIndex => $value) {
                $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 1);
                $sheet->setCellValue($columnLetter . ($rowIndex + 1), $value);
            }
        }

        // Auto-size columns
        foreach (range(1, count($data[0] ?? [])) as $columnIndex) {
            $sheet->getColumnDimensionByColumn($columnIndex)->setAutoSize(true);
        }

        // Write the spreadsheet to a temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'excel_');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        // Set the filename
        $filename = $filename . '-' . date('Y-m-d-His') . '.xlsx';

        // Return the file as a download
        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Export data as PDF.
     *
     * @param array $data
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    private function exportAsPdf(array $data, string $filename)
    {
        // Assumes you have a PDF library like DomPDF, mPDF, etc.
        // Example uses Laravel's PDF facade (you need to install a package like barryvdh/laravel-dompdf)

        // Extract headers and rows
        $headers = array_shift($data); // First row is headers
        $rows = $data;

        $pdf = PDF::loadView('exports.datatable', [
            'headers' => $headers,
            'rows' => $rows,
            'title' => $filename
        ]);

        $filename = $filename . '-' . date('Y-m-d-His') . '.pdf';

        return $pdf->download($filename);
    }
}

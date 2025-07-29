<?php

namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Support\DataTables\AbstractDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class DataTableController extends Controller
{
    public function process(Request $request, string $dataTable)
    {
        $instance = $this->resolve($dataTable);
        return response()->json($instance->process($request));
    }

    public function getFilterOptions(string $dataTable)
    {
        $instance = $this->resolve($dataTable);
        return response()->json([
            'filterOptions' => $instance->filterOptions(),
        ]);
    }

    protected function resolve(string $dataTable): AbstractDataTable
    {
        $class = "App\\Tenant\\HR\\DataTables\\{$dataTable}";

        if (!class_exists($class)) {
            abort(404, "DataTable class not found: {$class}");
        }

        return app($class);
    }

    public function export(Request $request)
    {
        // dd($request->all());
        $format = $request->input('format', 'csv');
        $className = $request->input('class');

        $dataTable = $this->resolve($className);
        $query = $dataTable->query();

        // Apply filters
        $filters = $request->input('filters', []);
        foreach ($filters as $column => $value) {
            if (empty($value))
                continue;

            if (str_contains($column, '.')) {
                [$relation, $field] = explode('.', $column);
                $query->whereHas($relation, function ($q) use ($field, $value) {
                    is_array($value) ? $q->whereIn($field, $value) : $q->where($field, $value);
                });
            } else {
                is_array($value)
                    ? $query->whereIn($column, $value)
                    : $query->where($column, $value);
            }
        }

        // Global search
        if ($global = $request->input('globalFilter')) {
            $columns = $dataTable->getColumns();
            $query->where(function ($q) use ($columns, $global) {
                foreach ($columns as $key => $column) {
                    if ($column['searchable'] ?? true) {
                        $name = $column['data'] ?? $key;
                        if (str_contains($name, '.')) {
                            [$rel, $field] = explode('.', $name);
                            $q->orWhereHas($rel, fn($subQ) => $subQ->where($field, 'like', "%$global%"));
                        } else {
                            $q->orWhere($name, 'like', "%$global%");
                        }
                    }
                }
            });
        }

        // Sort
        $sort = $request->input('sort', []);
        foreach ($sort as $sortItem) {
            if (isset($sortItem['id'])) {
                $direction = filter_var($sortItem['desc'], FILTER_VALIDATE_BOOLEAN) ? 'desc' : 'asc';
                $query->orderBy($sortItem['id'], $direction);
            }
        }

        $items = $query->get();

        // Use all columns if none are passed
        $visibleColumns = $request->input('columns', []);
        if (empty($visibleColumns)) {
            $visibleColumns = collect($dataTable->getColumns())->pluck('data')->all();
        }

        $exportData = $this->prepareExportData($dataTable, $items, $visibleColumns);

        // Use fileName from request or fallback to default
        $baseFileName = $request->input('fileName');

        return match ($format) {
            'excel' => $this->exportAsExcel($exportData, $baseFileName),
            'pdf' => $this->exportAsPdf($exportData, $baseFileName),
            default => $this->exportAsCsv($exportData, $baseFileName),
        };
    }


    private function prepareExportData($dataTable, $items, array $visibleColumns)
    {
        $columns = $dataTable->getColumns();
        $result = [];

        $headers = collect($columns)
            ->filter(fn($col) => in_array($col['data'], $visibleColumns) && ($col['exportable'] ?? true))
            ->pluck('title')
            ->all();
        $result[] = $headers;

        foreach ($items as $item) {
            $row = [];

            foreach ($columns as $column) {
                $name = $column['data'];

                if (!in_array($name, $visibleColumns) || !($column['exportable'] ?? true)) {
                    continue;
                }

                $value = method_exists($dataTable, $method = 'format' . Str::studly($name) . 'Column')
                    ? $dataTable->$method($item)
                    : (str_contains($name, '.') ? data_get($item, $name) : $item->{$name});

                if (($column['type'] ?? '') === 'date' && $value) {
                    $value = \Carbon\Carbon::parse($value)->format($column['dateFormat'] ?? 'Y-m-d H:i');
                }

                if (($column['type'] ?? '') === 'badge') {
                    $value = strip_tags($value);
                }

                if (($column['type'] ?? '') === 'actions') {
                    $value = '';
                }

                $row[] = $value;
            }

            $result[] = $row;
        }

        return $result;
    }

    private function exportAsCsv(array $data, string $filename)
    {
        $filename .= '-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($data) {
            $out = fopen('php://output', 'w');
            foreach ($data as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function exportAsExcel(array $data, string $filename)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($data as $r => $row) {
            foreach ($row as $c => $val) {
                $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c + 1);
                $sheet->setCellValue("{$col}" . ($r + 1), $val);
            }
        }

        foreach (range(1, count($data[0] ?? [])) as $colIdx) {
            $sheet->getColumnDimensionByColumn($colIdx)->setAutoSize(true);
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'excel_');
        (new Xlsx($spreadsheet))->save($tempFile);

        $filename . '.xlsx';

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    private function exportAsPdf(array $data, string $filename)
    {
        $headers = array_shift($data);
        $pdf = PDF::loadView('exports.datatable', [
            'headers' => $headers,
            'rows' => $data,
            'title' => $filename,
            'source' => 'HR'
        ]);

        $filename .= '-' . now()->format('Y-m-d-His') . '.pdf';

        return $pdf->download($filename);
    }

}

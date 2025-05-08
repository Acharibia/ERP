<?php

namespace App\Support\DataTables;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionProperty;

abstract class AbstractDataTable
{
    /**
     * Columns configuration.
     *
     * @var array
     */
    protected array $columns = [];

    /**
     * Query source of dataTable.
     *
     * @return EloquentBuilder|QueryBuilder
     */
    abstract public function query(): EloquentBuilder|QueryBuilder;

    /**
     * Build DataTable class.
     *
     * @return void
     */
    abstract public function build(): void;

    /**
     * Get the DataTable name.
     *
     * @return string
     */
    public function name(): string
    {
        $reflection = new ReflectionClass($this);
        $name = str_replace('DataTable', '', $reflection->getShortName());
        return Str::camel($name);
    }

    /**
     * Get the columns definition.
     *
     * @return array
     */
    public function getColumns(): array
    {
        // If columns are not yet defined, build them
        if (empty($this->columns)) {
            $this->build();
        }

        return $this->columns;
    }

    /**
     * Add a column to the DataTable.
     *
     * @param string $name
     * @param string|null $title
     * @param array $options
     * @return $this
     */
    public function addColumn(string $name, ?string $title = null, array $options = []): self
    {
        $title = $title ?? Str::title(str_replace('_', ' ', $name));

        $this->columns[$name] = array_merge([
            'data' => $name,
            'name' => $name,
            'title' => $title,
            'visible' => true,
            'searchable' => true,
            'orderable' => true,
            'exportable' => true,
            'type' => 'text',
            'className' => null,
        ], $options);

        return $this;
    }

    /**
     * Edit a column's configuration.
     *
     * @param string $name
     * @param array $options
     * @return $this
     */
    public function editColumn(string $name, array $options): self
    {
        if (isset($this->columns[$name])) {
            $this->columns[$name] = array_merge($this->columns[$name], $options);
        }

        return $this;
    }
    /**
     * Add a badge column.
     *
     * @param string $name
     * @param string|null $title
     * @param array $options
     * @param array $badgeConfig Map of values to badge configurations or simple color map
     * @return $this
     */
    public function addBadgeColumn(
        string $name,
        ?string $title = null,
        array $options = [],
        array $badgeConfig = []
    ): self {
        // Check if the config is a simple color map and convert it to full config
        $isSimpleColorMap = !empty($badgeConfig) && array_values($badgeConfig) === array_filter(array_values($badgeConfig), 'is_string');

        if ($isSimpleColorMap) {
            $fullConfig = [];
            foreach ($badgeConfig as $key => $color) {
                $fullConfig[$key] = ['color' => $color, 'icon' => null];
            }
            $badgeConfig = $fullConfig;
        }

        // Store badge configuration for use in transformation
        $options['badgeConfig'] = $badgeConfig ?: [
            'active' => ['color' => 'success', 'icon' => 'CheckCircle'],
            'inactive' => ['color' => 'secondary', 'icon' => 'CircleOff'],
            'pending' => ['color' => 'warning', 'icon' => 'Clock'],
            'error' => ['color' => 'destructive', 'icon' => 'AlertTriangle'],
            'default' => ['color' => 'default', 'icon' => null]
        ];

        return $this->addColumn($name, $title, array_merge([
            'type' => 'badge',
        ], $options));
    }
    /**
     * Add a relationship column.
     *
     * @param string $relationship
     * @param string $field
     * @param string|null $title
     * @param array $options
     * @param array $colorMap If it's a badge type, map of values to colors
     * @return $this
     */
    public function addRelationshipColumn(
        string $relationship,
        string $field,
        ?string $title = null,
        array $options = [],
        array $colorMap = []
    ): self {
        $name = $relationship . '.' . $field;
        $title = $title ?? Str::title(str_replace('_', ' ', $field));

        // If it's a badge type, store color mapping
        if (($options['type'] ?? null) === 'badge') {
            $options['colorMap'] = $colorMap ?: [
                'admin' => 'primary',
                'manager' => 'secondary',
                'user' => 'default',
                'default' => 'default'
            ];
        }

        return $this->addColumn($name, $title, array_merge([
            'orderable' => false,
            'relationship' => $relationship,
            'relationField' => $field
        ], $options));
    }

    /**
     * Add an action column.
     *
     * @param string $name
     * @param string|null $title
     * @param array $options
     * @return $this
     */
    public function addActionColumn(
        string $name = 'actions',
        ?string $title = 'Actions',
        array $actions = [
            ['name' => 'view', 'icon' => 'Eye'],
            ['name' => 'edit', 'icon' => 'Edit'],
            ['name' => 'delete', 'icon' => 'Trash2'],
        ]
    ): self {
        return $this->addColumn($name, $title, [
            'orderable' => false,
            'searchable' => false,
            'exportable' => false,
            'className' => 'dt-center',
            'visible' => true,
            'type' => 'actions',
            'actions' => $actions, // Store the available actions with icons
        ]);
    }

    /**
     * Add a date column.
     *
     * @param string $name
     * @param string|null $title
     * @param string $format The date format to use
     * @param array $options
     * @return $this
     */
    public function addDateColumn(
        string $name,
        ?string $title = null,
        string $format = 'Y-m-d H:i',
        array $options = []
    ): self {
        // Store format for use in transformation
        $options['dateFormat'] = $format;

        // Add a formatter method for this column
        $columnName = Str::studly($name);
        $this->{'format' . $columnName . 'Column'} = function ($item) use ($name, $format) {
            if (empty($item->{$name})) {
                return null;
            }
            return \Carbon\Carbon::parse($item->{$name})->format($format);
        };

        return $this->addColumn($name, $title, array_merge([
            'type' => 'date',
        ], $options));
    }

    /**
     * Process the DataTable.
     *
     * @param Request $request
     * @return array
     */
    public function process(Request $request): array
    {
        $query = $this->query();
        $columns = $this->getColumns();

        // Get total count before any filtering
        $totalRecords = $query->count();

        // Apply global search if needed
        if ($searchValue = $request->input('search.value')) {
            $this->applyGlobalSearch($query, $columns, $searchValue);
        }

        // Apply column filters
        $this->applyColumnFilters($query, $request);

        // Get filtered count AFTER applying filters but BEFORE pagination
        $totalFilteredRecords = $query->count();

        // Apply sorting
        $this->applySorting($query, $request, $columns);

        // Apply pagination (after filtering)
        $perPage = (int) $request->input('length', 10);
        $page = ($request->input('start', 0) / $perPage) + 1;

        $items = $query->forPage($page, $perPage)->get();

        // Transform data
        $data = $this->transform($items);

        return [
            'draw' => $request->input('draw', 0),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $totalFilteredRecords,
            'data' => $data,
            'columns' => $this->processColumns($columns),
            'tableName' => $this->name(),
            'visibleColumns' => $this->getDefaultVisibleColumns($columns),
            'pagination' => [
                'page' => $page,
                'pageSize' => $perPage,
                'pageCount' => ceil($totalFilteredRecords / $perPage),
                'total' => $totalFilteredRecords
            ],
            'filterOptions' => $this->filterOptions(),
        ];
    }

    /**
     * Transform the data for output.
     *
     * @param Collection $items
     * @return array
     */

    protected function transform(Collection $items): array
    {
        $columns = $this->getColumns();
        $data = [];

        foreach ($items as $item) {
            $row = [];
            foreach ($columns as $key => $column) {
                $name = $column['data'] ?? $key;

                // Check if there's a formatter defined
                if (method_exists($this, 'format' . Str::studly($name) . 'Column')) {
                    $value = $this->{'format' . Str::studly($name) . 'Column'}($item);
                } else {
                    // Handle nested attributes using dot notation
                    if (str_contains($name, '.')) {
                        $value = data_get($item, $name);
                    } else {
                        $value = $item->{$name} ?? null;

                        // Handle date columns automatically
                        if (($column['type'] ?? '') === 'date' && !empty($value)) {
                            $format = $column['dateFormat'] ?? 'Y-m-d H:i';
                            $value = \Carbon\Carbon::parse($value)->format($format);
                        }
                    }
                }

                $row[$name] = $value;
            }

            // Add row ID
            $row['id'] = $item->id ?? null;

            $data[] = $row;
        }

        return $data;
    }

    /**
     * Process the columns configuration.
     *
     * @param array $columns
     * @return array
     */
    protected function processColumns(array $columns): array
    {
        $result = [];

        foreach ($columns as $key => $column) {
            // Ensure column has required properties
            $name = $column['data'] ?? $key;
            $processedColumn = $column;

            $result[] = $processedColumn;
        }

        // Always add selection column if enabled
        if ($this->hasSelectColumn()) {
            array_unshift($result, [
                'data' => 'select',
                'name' => 'select',
                'title' => 'Select', // Change from '<Checkbox />' to a text label
                'visible' => true,
                'searchable' => false,
                'orderable' => false,
                'type' => 'checkbox',
                'className' => 'dt-center',
            ]);
        }

        return $result;
    }

    /**
     * Get the default visible columns.
     *
     * @param array $columns
     * @return array
     */
    protected function getDefaultVisibleColumns(array $columns): array
    {
        $visibleColumns = [];

        foreach ($columns as $key => $column) {
            $name = $column['data'] ?? $key;
            $visible = $column['visible'] ?? true;

            if ($visible) {
                $visibleColumns[] = $name;
            }
        }

        // Add select column if enabled
        if ($this->hasSelectColumn()) {
            array_unshift($visibleColumns, 'select');
        }

        return $visibleColumns;
    }

    /**
     * Apply global search to the query.
     *
     * @param EloquentBuilder|QueryBuilder $query
     * @param array $columns
     * @param string $searchValue
     * @return void
     */
    protected function applyGlobalSearch($query, array $columns, string $searchValue): void
    {
        $query->where(function ($q) use ($columns, $searchValue) {
            foreach ($columns as $key => $column) {
                $name = $column['data'] ?? $key;
                $searchable = $column['searchable'] ?? true;

                if ($searchable) {
                    // Handle relations using dot notation
                    if (str_contains($name, '.')) {
                        list($relation, $field) = $this->parseRelationField($name);
                        $q->orWhereHas($relation, function ($subQuery) use ($field, $searchValue) {
                            $subQuery->where($field, 'like', "%{$searchValue}%");
                        });
                    } else {
                        // Regular column
                        $q->orWhere($name, 'like', "%{$searchValue}%");
                    }
                }
            }
        });
    }

    /**
     * Apply column-specific filters.
     *
     * @param EloquentBuilder|QueryBuilder $query
     * @param Request $request
     * @return void
     */
    protected function applyColumnFilters($query, Request $request): void
    {
        $filters = $request->input('filters', []);

        foreach ($filters as $column => $value) {
            if (empty($value)) {
                continue;
            }

            // Handle relations using dot notation
            if (str_contains($column, '.')) {
                list($relation, $field) = $this->parseRelationField($column);
                $query->whereHas($relation, function ($subQuery) use ($field, $value) {
                    if (is_array($value)) {
                        $subQuery->whereIn($field, $value);
                    } else {
                        $subQuery->where($field, 'like', "%{$value}%");
                    }
                });
            } else {
                // Regular column
                if (is_array($value)) {
                    $query->whereIn($column, $value);
                } else {
                    $query->where($column, 'like', "%{$value}%");
                }
            }
        }
    }

    /**
     * Apply sorting to the query.
     *
     * @param EloquentBuilder|QueryBuilder $query
     * @param Request $request
     * @param array $columns
     * @return void
     */
    protected function applySorting($query, Request $request, array $columns): void
    {
        $sortColumn = $request->input('order.0.column', 0);
        $sortDir = $request->input('order.0.dir', 'asc');

        // Fallback to default sort if not specified
        if ($request->has('sort')) {
            $sortData = $request->input('sort', []);
            if (!empty($sortData)) {
                foreach ($sortData as $sort) {
                    if (isset($sort['id']) && isset($sort['desc'])) {
                        $columnName = $sort['id'];
                        $direction = $sort['desc'] ? 'desc' : 'asc';

                        // Handle relations
                        if (str_contains($columnName, '.')) {
                            // For relations, we might need more complex logic
                            // This is a simplified approach
                            list($relation, $field) = $this->parseRelationField($columnName);
                            $query->orderBy($columnName, $direction);
                        } else {
                            $query->orderBy($columnName, $direction);
                        }
                    }
                }
            }
        } elseif (isset($columns[$sortColumn]) && $this->isColumnOrderable($columns[$sortColumn])) {
            $columnName = $this->getColumnName($columns[$sortColumn]);
            $query->orderBy($columnName, $sortDir);
        }
    }

    /**
     * Parse relation and field from dot notation.
     *
     * @param string $name
     * @return array
     */
    protected function parseRelationField(string $name): array
    {
        $parts = explode('.', $name);
        $field = array_pop($parts);
        $relation = implode('.', $parts);

        return [$relation, $field];
    }

    /**
     * Get column name.
     *
     * @param array $column
     * @return string
     */
    protected function getColumnName(array $column): string
    {
        return $column['data'] ?? $column['name'] ?? '';
    }

    /**
     * Check if column is orderable.
     *
     * @param array $column
     * @return bool
     */
    protected function isColumnOrderable(array $column): bool
    {
        return $column['orderable'] ?? true;
    }

    /**
     * Check if DataTable should include a select column.
     *
     * @return bool
     */
    public function hasSelectColumn(): bool
    {
        return true; // Default to true, can be overridden in child classes
    }

    /**
     * Get additional data to be sent with the response.
     *
     * @return array
     */
    public function filterOptions(): array
    {
        return [];
    }
}

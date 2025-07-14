<?php
namespace App\Support\DataTables;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use ReflectionClass;

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
     * Dynamic action column callbacks.
     *
     * @var array<string, callable>
     */
    protected array $actionCallbacks = [];

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
        if (empty($this->columns)) {
            $this->build();
        }
        return array_values($this->columns);
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


    public function addEnumColumn(string $name, string $label, string $enumClass, array $options = []): static
    {
        $this->addColumn($name, $label, $options);

        return $this->editColumn($name, [
            'formatter' => fn($value) => $value instanceof $enumClass
                ? $value->label()
                : $enumClass::fromValue($value)?->label() ?? $value,

        ]);
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
            'default' => ['color' => 'default', 'icon' => null],
        ];

        return $this->addColumn($name, $title, array_merge([
            'type' => 'badge',
        ], $options));
    }

    /**
     * Add a relationship column.
     *
     * @param string $relationship The relationship name (e.g., 'department')
     * @param string $field The field to display from the related model (e.g., 'name')
     * @param string|null $title Column title
     * @param array $options Additional column options
     * @param string $relatedTable The related table name (e.g., 'departments')
     * @param string $foreignKey The foreign key in the main table (e.g., 'department_id')
     * @param string $relatedKey The primary key in the related table (e.g., 'id')
     * @return $this
     */
    public function addRelationshipColumn(
        string $relationship,
        string $field,
        ?string $title = null,
        array $options = [],
        string $relatedTable = '',
        string $foreignKey = '',
        string $relatedKey = 'id',
    ): self {
        $name = $relationship . '.' . $field;
        $title = $title ?? Str::title(str_replace('_', ' ', $field));

        // Auto-generate table and foreign key if not provided
        if (empty($relatedTable)) {
            $relatedTable = Str::plural($relationship);
        }
        if (empty($foreignKey)) {
            $foreignKey = $relationship . '_id';
        }
        return $this->addColumn($name, $title, array_merge([
            'orderable' => true,
            'searchable' => true,
            'relationship' => $relationship,
            'relationField' => $field,
            'relatedTable' => $relatedTable,
            'foreignKey' => $foreignKey,
            'relatedKey' => $relatedKey,
            'isRelationship' => true,
        ], $options));
    }

    public function addRelationshipBadgeColumn(
        string $relationship,
        string $field,
        ?string $title = null,
        array $badgeConfig = [],
        string $relatedTable = '',
        string $foreignKey = '',
        string $relatedKey = 'id',
    ): self {
        $options = [
            'type' => 'badge',
            'badgeConfig' => $badgeConfig,
        ];

        return $this->addRelationshipColumn(
            relationship: $relationship,
            field: $field,
            title: $title,
            options: $options,
            relatedTable: $relatedTable,
            foreignKey: $foreignKey,
            relatedKey: $relatedKey
        );
    }


    /**
     * Add an action column.
     *
     * @param string $name
     * @param string|null $title
     * @param array|callable $actions
     * @return $this
     */

    public function addActionColumn(
        string $name = 'actions',
        ?string $title = 'Actions',
        array|callable $actions = [
            ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
            ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
            ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
        ]
    ): self {
        $column = [
            'orderable' => false,
            'searchable' => false,
            'exportable' => false,
            'className' => 'text-center',
            'visible' => true,
            'type' => 'actions',
        ];

        // Store callable in a separate map to be used when resolving rows
        if (is_callable($actions)) {
            $this->actionCallbacks[$name] = $actions;
        } else {
            $column['actions'] = $actions;
        }

        return $this->addColumn($name, $title, $column);
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
                'total' => $totalFilteredRecords,
            ],
            'filterOptions' => $this->filterOptions(),
            'bulkActions' => $this->bulkActions(),
        ];

    }

    /**
     * Transform the data for output.
     *
     * @param \Illuminate\Support\Collection $items
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

                if (($column['isRelationship'] ?? false) && isset($column['relationship'], $column['relationField'])) {
                    $relationshipPath = explode('.', $column['relationship']);
                    $field = $column['relationField'];

                    $nested = &$row;

                    foreach ($relationshipPath as $segment) {
                        if (!isset($nested[$segment])) {
                            $nested[$segment] = [];
                        }
                        $nested = &$nested[$segment];
                    }

                    // Assign field under the final nested object
                    $relatedObject = $item;
                    foreach ($relationshipPath as $segment) {
                        $relatedObject = $relatedObject->{$segment} ?? null;
                        if (!$relatedObject)
                            break;
                    }

                    $nested[$field] = $relatedObject?->{$field} ?? null;
                } else {
                    $value = $item->{$name} ?? null;

                    // Apply date formatting
                    if (($column['type'] ?? null) === 'date' && isset($column['dateFormat']) && $value) {
                        try {
                            $value = \Carbon\Carbon::make($value)?->format($column['dateFormat']);
                        } catch (\Exception $e) {
                            $value = $item->{$name};
                        }
                    }

                    // ✅ Apply formatter if available
                    if (isset($column['formatter']) && is_callable($column['formatter'])) {
                        $value = call_user_func($column['formatter'], $value, $item);
                    }

                    $row[$name] = $value;

                }
            }

            $row['id'] = $item->id ?? null;

            foreach ($this->actionCallbacks as $columnName => $callback) {
                $row[$columnName] = call_user_func($callback, $item);
            }

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
                'title' => 'Select',
                'visible' => true,
                'searchable' => false,
                'orderable' => false,
                'type' => 'checkbox',
                'className' => 'dt-center ',
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
                    if ($column['isRelationship'] ?? false) {
                        $relationship = $column['relationship'];
                        $field = $column['relationField'];

                        $q->orWhereHas($relationship, function ($subQuery) use ($field, $searchValue) {
                            $subQuery->where($field, 'ILIKE', "%{$searchValue}%");
                        });
                    } else {
                        $q->orWhere($name, 'ILIKE', "%{$searchValue}%");
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

        foreach ($filters as $columnName => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            // Fix: find column config correctly
            $column = collect($this->getColumns())->firstWhere('data', $columnName);

            if (!$column) {
                continue;
            }

            if ($column['isRelationship'] ?? false) {
                $relationship = $column['relationship'];
                $field = $column['relationField'];

                $query->whereHas($relationship, function ($subQuery) use ($field, $value) {
                    if (is_array($value)) {
                        $subQuery->whereIn($field, $value);
                    } else {
                        $subQuery->where($field, '=', $value);
                    }
                });
            } else {
                if (is_array($value)) {
                    $query->whereIn($columnName, $value);
                } else {
                    $query->where($columnName, '=', $value);
                }
            }
        }
    }


    /**
     * Apply sorting to the query using request data.
     *
     * @param \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder $query
     * @param \Illuminate\Http\Request $request
     * @param array $columns
     * @return void
     */
    protected function applySorting($query, Request $request, array $columns): void
    {
        $sorts = $request->input('sort', []);

        foreach ($sorts as $sort) {
            $columnName = $sort['id'] ?? null;
            $direction = ($sort['desc'] ?? false) ? 'desc' : 'asc';

            if ($columnName) {
                $this->applySingleSort($query, $columnName, $direction, $columns);
            }
        }
    }


    /**
     * Apply a single column sort to the query.
     *
     * @param \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder $query
     * @param string $columnName
     * @param string $direction
     * @param array $columns
     * @return void
     */
    protected function applySingleSort($query, string $columnName, string $direction, array $columns): void
    {
        // Get the column configuration
        $column = collect($columns)->firstWhere('data', $columnName);

        if (!$column) {
            return;
        }

        // Normalize sort direction
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        // Relationship-based sorting
        if ($column['isRelationship'] ?? false) {
            $relatedTable = $column['relatedTable'] ?? null;
            $foreignKey = $column['foreignKey'] ?? null;
            $relatedKey = $column['relatedKey'] ?? 'id';
            $field = $column['relationField'] ?? null;

            if (!$relatedTable || !$foreignKey || !$field) {
                return;
            }

            $query->orderBy(
                function ($subQuery) use ($relatedTable, $foreignKey, $relatedKey, $field) {
                    $subQuery->select($field)
                        ->from($relatedTable)
                        ->whereColumn("$relatedTable.$relatedKey", $this->getMainTable() . '.' . $foreignKey)
                        ->limit(1);
                },
                $direction
            );

        } else {
            // Direct column sort
            $query->orderBy($columnName, $direction);
        }
    }


    /**
     * Get the main table name from the query.
     *
     * @return string
     */
    protected function getMainTable(): string
    {
        $query = $this->query();
        return $query->getModel()->getTable();
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

    /**
     * Define available bulk actions.
     *
     * @return array
     */
    public function bulkActions(): array
    {
        return [];
    }
}

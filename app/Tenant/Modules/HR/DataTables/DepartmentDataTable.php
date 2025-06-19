<?php

namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Models\Department;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class DepartmentDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     *
     * @return EloquentBuilder|QueryBuilder
     */
    public function query(): EloquentBuilder|QueryBuilder
    {
        return Department::query()->select([
            'id',
            'name',
            'description',
            'status',
            'created_at',
            'updated_at'
        ]);
    }

    /**
     * Build DataTable class.
     *
     * @return void
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible' => false
        ])
            ->addColumn('name', 'Name', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addColumn('description', 'Description', [
                'searchable' => true,
                'orderable' => true,
                'className' => 'text-muted-foreground'
            ])
            ->addBadgeColumn('status', 'Status', [], [
                'active' => [
                    'color' => 'default',
                    'icon' => 'CheckCircle'
                ],
                'inactive' => [
                    'color' => 'secondary',
                    'icon' => 'CircleOff'
                ],
                'default' => [
                    'color' => 'secondary',
                    'icon' => 'CircleOff'
                ]
            ])
            ->addDateColumn('created_at', 'Date Created', 'M j, Y g:i a', [
                'searchable' => false,
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground'
            ])
            ->addActionColumn('actions', 'Actions', [
                ['name' => 'view', 'icon' => 'Eye'],
                ['name' => 'edit', 'icon' => 'Edit'],
                ['name' => 'delete', 'icon' => 'Trash2'],
                ['name' => 'suspend', 'icon' => 'Ban']
            ]);
    }

    /**
     * Get filter options for the DataTable.
     *
     * @return array
     */
    public function filterOptions(): array
    {
        return [
            'status' => $this->getStatusOptions(),
        ];
    }

    /**
     * Get status filter options.
     *
     * @return array
     */
    protected function getStatusOptions(): array
    {
        return [
            [
                'label' => 'Active',
                'value' => 'active',
                'icon' => 'CheckCircle'
            ],
            [
                'label' => 'Inactive',
                'value' => 'inactive',
                'icon' => 'CircleOff'
            ],
        ];
    }

    /**
     * Check if DataTable should include a select column.
     *
     * @return bool
     */
    public function hasSelectColumn(): bool
    {
        return true;
    }

    /**
     * Get the DataTable name for identification.
     *
     * @return string
     */
    public function name(): string
    {
        return 'department';
    }
}

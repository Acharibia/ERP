<?php

namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\HR\Models\Program;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class ProgramDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     *
     * @return EloquentBuilder|QueryBuilder
     */
    public function query(): EloquentBuilder|QueryBuilder
    {
        return Program::query();
    }

    /**
     * Build DataTable class.
     *
     * @return void
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible' => false,
            'exportable' => false
        ])
            ->addColumn('title', 'Title', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addColumn('description', 'Description', [
                'searchable' => true,
                'orderable' => false,
                'className' => 'text-muted-foreground'
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'searchable' => true,
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground'
            ])
            ->addActionColumn('actions', 'Actions', function ($program) {
                return [
                    ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                    ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                    ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                ];
            });
    }

    /**
     * Get bulk actions for the DataTable.
     *
     * @return array
     */
    public function bulkActions(): array
    {
        return [
            [
                'label' => 'Delete',
                'value' => 'delete',
                'icon' => 'Trash2',
                'variant' => 'destructive',
            ],
        ];
    }

    /**
     * Get filter options for the DataTable.
     *
     * @return array
     */
    public function filterOptions(): array
    {
        return [];
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
        return 'program';
    }
}

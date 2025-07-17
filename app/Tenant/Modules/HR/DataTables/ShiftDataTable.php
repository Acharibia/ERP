<?php

namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Models\Shift;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class ShiftDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder|QueryBuilder
    {
        return Shift::query();
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible' => false,
            'exportable' => false,
        ])
        ->addColumn('name', 'Name')
        ->addColumn('start_time', 'Start Time')
        ->addColumn('end_time', 'End Time')
        ->addColumn('max_employees', 'Max Employees')
        ->addColumn('location', 'Location')
        ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
            'className' => 'text-sm text-muted-foreground',
        ])
        ->addActionColumn('actions', 'Actions', function ($shift) {
            return [
                ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
            ];
        });
    }

    public function filterOptions(): array
    {
        return [
            // Example: 'location' => $this->getLocationOptions(),
        ];
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'shift';
    }
}

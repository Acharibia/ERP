<?php
namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Spatie\Permission\Models\Role;

class RoleAccessDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder | QueryBuilder
    {
        return Role::query()->where('module', 'hr');
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addColumn('name', 'Name', [
                'searchable' => true,
            ])
            ->addColumn('description', 'Description', [
                'searchable' => true,
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className'  => 'text-sm text-muted-foreground',
                'sortable'   => true,
                'searchable' => true,
            ])

            ->addActionColumn('actions', 'Actions', function ($role) {
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

        ];
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'role';
    }
}

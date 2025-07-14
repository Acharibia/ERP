<?php

namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Enum\DepartmentStatus;
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
        return Department::query();
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
                DepartmentStatus::ACTIVE->value => [
                    'color' => 'default',
                    'icon' => 'CheckCircle',
                ],
                DepartmentStatus::INACTIVE->value => [
                    'color' => 'destructive',
                    'icon' => 'CircleOff',
                ],
                DepartmentStatus::SUSPENDED->value => [
                    'color' => 'outline',
                    'icon' => 'Ban',
                ],
                'default' => [
                    'color' => 'secondary',
                    'icon' => 'CircleOff',
                ],
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'searchable' => true,
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground'
            ])
            ->addActionColumn('actions', 'Actions', function ($department) {
                return match ($department->status) {
                    DepartmentStatus::ACTIVE => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'suspend', 'icon' => 'Ban', 'label' => 'Suspend'],
                        ['name' => 'deactivate', 'icon' => 'CircleOff', 'label' => 'Deactivate'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    DepartmentStatus::INACTIVE => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'activate', 'icon' => 'CheckCircle', 'label' => 'Activate'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],

                    ],
                    DepartmentStatus::SUSPENDED => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'activate', 'icon' => 'CheckCircle', 'label' => 'Activate'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],

                    ],
                };

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
                'label' => 'Activate',
                'value' => 'activate',
                'icon' => 'CheckCircle',
                'variant' => 'default',
            ],
            [
                'label' => 'Suspend',
                'value' => 'suspend',
                'icon' => 'Ban',
                'variant' => 'secondary',
            ],
            [
                'label' => 'Deactivate',
                'value' => 'deactivate',
                'icon' => 'CircleOff',
                'variant' => 'outline',
            ],
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
        return collect(DepartmentStatus::cases())->map(function (DepartmentStatus $status) {
            return [
                'label' => ucfirst(strtolower($status->name)),
                'value' => $status->value,
                'icon' => match ($status) {
                    DepartmentStatus::ACTIVE => 'CheckCircle',
                    DepartmentStatus::INACTIVE => 'CircleOff',
                    DepartmentStatus::SUSPENDED => 'Ban',
                },
            ];
        })->all();
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

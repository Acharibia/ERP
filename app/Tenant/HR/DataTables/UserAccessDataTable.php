<?php
namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Core\Models\User;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class UserAccessDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     */
    public function query(): EloquentBuilder | QueryBuilder
    {
        return User::query()
            ->with(['roles', 'permissions'])
            ->orderBy('name');
    }

    /**
     * Build DataTable class.
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addColumn('name', 'Name', [
                'searchable' => true,
                'orderable'  => true,
            ])
            ->addColumn('email', 'Email', [
                'searchable' => true,
                'orderable'  => true,
            ])
            ->addBadgeColumn('status', 'Status', [], [
                'active'    => [
                    'color' => 'default',
                    'icon'  => 'CheckCircle',
                ],
                'inactive'  => [
                    'color' => 'secondary',
                    'icon'  => 'CircleOff',
                ],
                'suspended' => [
                    'color' => 'destructive',
                    'icon'  => 'Ban',
                ],
                'default'   => [
                    'color' => 'muted',
                    'icon'  => 'HelpCircle',
                ],
            ])
            ->addBadgeColumn('roles', 'Roles', [
                'searchable' => false,
                'orderable'  => false,
            ], [
                'no_roles'       => [
                    'color' => 'muted',
                    'icon'  => 'UserX',
                    'label' => 'No roles',
                ],
                'single_role'    => [
                    'color' => 'default',
                    'icon'  => 'User',
                    'label' => '1 role',
                ],
                'multiple_roles' => [
                    'color' => 'secondary',
                    'icon'  => 'Users',
                    'label' => 'Multiple roles',
                ],
            ])
            ->addBadgeColumn('permissions', 'Direct Permissions', [
                'searchable' => false,
                'orderable'  => false,
            ], [
                'no_permissions'  => [
                    'color' => 'muted',
                    'icon'  => 'ShieldOff',
                    'label' => 'None',
                ],
                'has_permissions' => [
                    'color' => 'outline',
                    'icon'  => 'Shield',
                    'label' => 'Has permissions',
                ],
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'searchable' => true,
                'orderable'  => true,
                'className'  => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($user) {
                return [
                    ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                    ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit Access'],
                ];
            });
    }

    /**
     * Get bulk actions for the DataTable.
     */
    public function bulkActions(): array
    {
        return [
            [
                'label'   => 'Assign Roles',
                'value'   => 'assign_roles',
                'icon'    => 'UserPlus',
                'variant' => 'default',
            ],
            [
                'label'   => 'Remove Roles',
                'value'   => 'remove_roles',
                'icon'    => 'UserMinus',
                'variant' => 'secondary',
            ],
            [
                'label'   => 'Assign Permissions',
                'value'   => 'assign_permissions',
                'icon'    => 'Shield',
                'variant' => 'outline',
            ],
            [
                'label'   => 'Remove Permissions',
                'value'   => 'remove_permissions',
                'icon'    => 'ShieldOff',
                'variant' => 'destructive',
            ],
        ];
    }

    /**
     * Get filter options for the DataTable.
     */
    public function filterOptions(): array
    {
        return [
            'status' => $this->getStatusOptions(),
        ];
    }

    /**
     * Get status filter options.
     */
    protected function getStatusOptions(): array
    {
        return [
            [
                'label' => 'Active',
                'value' => 'active',
                'icon'  => 'CheckCircle',
            ],
            [
                'label' => 'Inactive',
                'value' => 'inactive',
                'icon'  => 'CircleOff',
            ],
            [
                'label' => 'Suspended',
                'value' => 'suspended',
                'icon'  => 'Ban',
            ],
        ];
    }

    /**
     * Check if DataTable should include a select column.
     */
    public function hasSelectColumn(): bool
    {
        return true;
    }

    /**
     * Get the DataTable name for identification.
     */
    public function name(): string
    {
        return 'user-access';
    }
}

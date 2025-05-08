<?php

namespace App\Admins\DataTables;

use App\Central\Models\Role;
use App\Central\Models\User;
use App\Support\DataTables\AbstractDataTable;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class UserDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     *
     * @return EloquentBuilder|QueryBuilder
     */
    public function query(): EloquentBuilder|QueryBuilder
    {
        return User::query()->with(['roles']);
    }

    /**
     * Build DataTable class.
     *
     * @return void
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', ['className' => 'font-medium', 'visible' => false])
            ->addColumn('name', 'Name')
            ->addColumn('email', 'Email')
            ->addColumn('user_type', 'User Type')
            ->addBadgeColumn(
                'status',
                'Status',
                [],
                [
                    'active' => ['color' => 'default', 'icon' => 'CheckCircle'],
                    'inactive' => ['color' => 'secondary', 'icon' => 'CircleOff'],
                    'suspended' => ['color' => 'outline', 'icon' => 'AlertTriangle'],
                    'banned' => ['color' => 'destructive', 'icon' => 'Ban']
                ]
            )
            ->addDateColumn('created_at', 'Date Created', 'M j, Y g:i a', ['searchable' => false])
            ->addActionColumn('actions', 'Actions', [
                ['name' => 'view', 'icon' => 'Eye'],
                ['name' => 'edit', 'icon' => 'Edit'],
                ['name' => 'delete', 'icon' => 'Trash2'],
                ['name' => 'suspend', 'icon' => 'Ban']
            ], );
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
            'user_type' => [
                ['label' => 'System Admin', 'value' => 'system_admin'],
                ['label' => 'Reseller', 'value' => 'reseller'],
                ['label' => 'Business User', 'value' => 'business_user'],
            ],
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
            ['label' => 'Active', 'value' => 'active', 'icon' => 'CheckCircle'],
            ['label' => 'Inactive', 'value' => 'inactive', 'icon' => 'CircleOff'],
            ['label' => 'Suspended', 'value' => 'suspended', 'icon' => 'AlertTriangle'],
            ['label' => 'Banned', 'value' => 'banned', 'icon' => 'Ban'],
        ];
    }


}

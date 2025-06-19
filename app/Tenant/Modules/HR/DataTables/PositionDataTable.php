<?php

namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Enum\EmploymentType;
use App\Tenant\Modules\HR\Enum\PositionLevel;
use App\Tenant\Modules\HR\Models\Position;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class PositionDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     *
     * @return EloquentBuilder|QueryBuilder
     */
    public function query(): EloquentBuilder|QueryBuilder
    {
        return Position::query()
            ->with(['department:id,name']);
    }

    /**
     * Build DataTable class.
     *
     * @return void
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'className' => 'font-medium',
            'visible' => false
        ])

            ->addColumn('title', 'Title', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addRelationshipColumn(
                relationship: 'department',
                field: 'name',
                title: 'Department',
                options: [
                    'searchable' => true,
                    'orderable' => true,
                ],
                relatedTable: 'departments',
                foreignKey: 'department_id',
                relatedKey: 'id'
            )
            ->addColumn('employment_type', 'Type', [
                'searchable' => true,
                'orderable' => true,
                'className' => 'capitalize'
            ])
            ->addColumn('position_level', 'Level', [
                'searchable' => true,
                'orderable' => true,
                'className' => 'capitalize'
            ])
            ->addBadgeColumn('status', 'Status', [
                'searchable' => true,
                'orderable' => true,
            ], [
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
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'searchable' => false,
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground'
            ])
            ->addActionColumn('actions', 'Actions', [
                ['name' => 'view', 'icon' => 'Eye'],
                ['name' => 'edit', 'icon' => 'Edit'],
                ['name' => 'delete', 'icon' => 'Trash2']
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
            'employment_type' => $this->getEmploymentTypeOptions(),
            'position_level' => $this->getPositionLevelOptions(),
            'department.name' => $this->getDepartmentOptions(),
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
     * Get employment type filter options.
     *
     * @return array
     */
    protected function getEmploymentTypeOptions(): array
    {
        return collect(EmploymentType::cases())->map(function ($case) {
            return [
                'label' => $case->label(),
                'value' => $case->value,
            ];
        })->toArray();
    }

    /**
     * Get position level filter options.
     *
     * @return array
     */
    protected function getPositionLevelOptions(): array
    {
        return collect(PositionLevel::cases())->map(function ($case) {
            return [
                'label' => $case->label(),
                'value' => $case->value,
            ];
        })->toArray();
    }

    /**
     * Get department filter options.
     *
     * @return array
     */
    protected function getDepartmentOptions(): array
    {
        return \App\Tenant\Modules\HR\Models\Department::active()
            ->get(['id', 'name'])
            ->map(function ($department) {
                return [
                    'label' => $department->name,
                    'value' => $department->name,
                ];
            })
            ->toArray();
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
        return 'position';
    }
}

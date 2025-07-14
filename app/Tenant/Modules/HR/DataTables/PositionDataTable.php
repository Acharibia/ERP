<?php

namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Enum\EmploymentType;
use App\Tenant\Modules\HR\Enum\PositionLevel;
use App\Tenant\Modules\HR\Enum\PositionStatus;
use App\Tenant\Modules\HR\Models\Department;
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
        return Position::query()->with(['department:id,name']);
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
            'exportable' => false,
        ])
            ->addColumn('title', 'Title', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addRelationshipColumn(
                relationship: 'department',
                field: 'name',
                title: 'Department',
            )
            ->addEnumColumn('employment_type', 'Employment', EmploymentType::class, [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addEnumColumn('position_level', 'Level', PositionLevel::class, [
                'searchable' => true,
                'orderable' => true,
                'className' => 'capitalize',
            ])

            ->addBadgeColumn('status', 'Status', [], [
                'active' => [
                    'color' => 'default',
                    'icon' => 'CheckCircle',
                ],
                'inactive' => [
                    'color' => 'secondary',
                    'icon' => 'CircleOff',
                ],
                'default' => [
                    'color' => 'secondary',
                    'icon' => 'CircleOff',
                ],
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'searchable' => false,
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($position) {
                return match ($position->status) {
                    PositionStatus::ACTIVE => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'deactivate', 'icon' => 'CircleOff', 'label' => 'Deactivate'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    PositionStatus::INACTIVE => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'activate', 'icon' => 'CheckCircle', 'label' => 'Activate'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    default => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ]
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
                'icon' => 'CheckCircle',
            ],
            [
                'label' => 'Inactive',
                'value' => 'inactive',
                'icon' => 'CircleOff',
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
        return collect(EmploymentType::cases())->map(fn($case) => [
            'label' => $case->label(),
            'value' => $case->value,
        ])->toArray();
    }

    /**
     * Get position level filter options.
     *
     * @return array
     */
    protected function getPositionLevelOptions(): array
    {
        return collect(PositionLevel::cases())->map(fn($case) => [
            'label' => $case->label(),
            'value' => $case->value,
        ])->toArray();
    }

    /**
     * Get department filter options.
     *
     * @return array
     */
    protected function getDepartmentOptions(): array
    {
        return Department::active()
            ->get(['id', 'name'])
            ->map(fn($department) => [
                'label' => $department->name,
                'value' => $department->name,
            ])
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

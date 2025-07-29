<?php
namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Position;
use App\Tenant\HR\Models\ShiftRotation;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class ShiftRotationDataTable extends AbstractDataTable
{
    protected $departmentsMap = [];
    protected $positionsMap   = [];
    protected $rolesMap       = [];

    public function query(): EloquentBuilder | QueryBuilder
    {
        return ShiftRotation::query()->with(['employee.personalInfo', 'shift']);
    }

    public function build(): void
    {
        $departmentsMap = Department::all()->keyBy('id');
        $positionsMap   = Position::all()->keyBy('id');
        $rolesMap       = Role::all()->keyBy('id');

        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])

            ->addRelationshipColumn(
                relationship: 'employee.personalInfo',
                field: 'name',
                title: 'Employee',
                relatedTable: 'employee_personal_info',
                foreignKey: 'employee_id',
                relatedKey: 'employee_id',
                options: [
                    'searchable' => true,
                    'orderable'  => false,
                ]
            )->addColumn('department_ids', 'Departments', [
            'orderable' => false,
            'formatter' => function ($value, $row) use ($departmentsMap) {
                if (! $value || empty($value)) {
                    return '-';
                }

                $names = collect($value)
                    ->map(fn($id) => $departmentsMap[$id]->name ?? null)
                    ->filter()
                    ->toArray();
                return $names ? implode(', ', $names) : '-';
            },
        ])
            ->addColumn('position_ids', 'Positions', [
                'orderable' => false,
                'formatter' => function ($value, $row) use ($positionsMap) {
                    if (! $value || empty($value)) {
                        return '-';
                    }

                    $titles = collect($value)
                        ->map(fn($id) => $positionsMap[$id]->title ?? null)
                        ->filter()
                        ->toArray();
                    return $titles ? implode(', ', $titles) : '-';
                },
            ])
            ->addColumn('role_ids', 'Roles', [
                'orderable' => false,
                'formatter' => function ($value, $row) use ($rolesMap) {
                    if (! $value || empty($value)) {
                        return '-';
                    }

                    $names = collect($value)
                        ->map(function ($id) use ($rolesMap) {
                            $name = $rolesMap[$id]->name ?? null;
                            return $name ? Str::of($name)->replace('_', ' ')->title() : null;
                        })
                        ->filter()
                        ->toArray();
                    return $names ? implode(', ', $names) : '-';
                },
            ])
            ->addColumn('start_date', 'Start Date')
            ->addDateColumn('start_date', 'Start Date', 'M j, Y', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addColumn('end_date', 'End Date')
            ->addDateColumn('end_date', 'End Date', 'M j, Y', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addBadgeColumn('is_recurring', 'Recurring', [
                true  => 'Yes',
                false => 'No',
            ], [
                true  => 'success',
                false => 'secondary',
            ])
            ->addBadgeColumn('frequency', 'Frequency', [
                'daily'     => 'Daily',
                'weekly'    => 'Weekly',
                'bi-weekly' => 'Bi-Weekly',
                'custom'    => 'Custom',
            ], [
                'daily'     => 'info',
                'weekly'    => 'primary',
                'bi-weekly' => 'secondary',
                'custom'    => 'default',
            ])
            ->addColumn('interval', 'Interval')
            ->addBadgeColumn('status', 'Status', [
                'active'   => 'Active',
                'inactive' => 'Inactive',
            ], [
                'active'   => 'success',
                'inactive' => 'secondary',
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($rotation) {
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
            'employee.personalInfo.name' => $this->getEmployeeOptions(),
            'status'                     => [
                ['id' => 'active', 'name' => 'Active', 'value' => 'active'],
                ['id' => 'inactive', 'name' => 'Inactive', 'value' => 'inactive'],
            ],
        ];
    }

    protected function getEmployeeOptions(): array
    {
        return Employee::with('personalInfo')
            ->get()
            ->map(fn($e) => [
                'id'    => $e->id,
                'name'  => $e->personalInfo?->name ?? 'Employee #' . $e->id,
                'value' => $e->personalInfo?->name ?? 'Employee #' . $e->id,
            ])
            ->toArray();
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'shiftRotation';
    }
}

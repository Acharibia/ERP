<?php
namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\HR\Enum\EmploymentStatus;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Position;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Str;

class EmployeeDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder | QueryBuilder
    {
        return Employee::query()->with([
            'personalInfo',
            'employmentInfo.position',
            'employmentInfo.department',
        ]);
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addRelationshipColumn(
                relationship: 'personalInfo',
                field: 'name',
                title: 'Name',
                relatedTable: 'employee_personal_info',
                foreignKey: 'id',
                relatedKey: 'employee_id'
            )
            ->addRelationshipColumn(
                relationship: 'personalInfo',
                field: 'work_email',
                title: 'Email',
                relatedTable: 'employee_personal_info',
                foreignKey: 'id',
                relatedKey: 'employee_id'
            )
            ->addRelationshipColumn(
                relationship: 'personalInfo',
                field: 'work_phone',
                title: 'Phone',
                relatedTable: 'employee_personal_info',
                foreignKey: 'id',
                relatedKey: 'employee_id'
            )
            ->addRelationshipColumn(
                relationship: 'employmentInfo.position',
                field: 'title',
                title: 'Position',
                relatedTable: 'positions',
                foreignKey: 'id',
                relatedKey: 'id'
            )
            ->addRelationshipBadgeColumn(
                'employmentInfo',
                'employment_status',
                'Status',
                badgeConfig: [
                    ['active' => 'success'],
                    ['inactive' => 'secondary'],
                    ['terminated' => 'destructive'],
                    ['on_leave' => 'warning'],
                ],
                relatedTable: 'employee_employment_info',
                foreignKey: 'id',
                relatedKey: 'employee_id'
            )

            ->addRelationshipColumn(
                relationship: 'employmentInfo.department',
                field: 'name',
                title: 'Department',
                relatedTable: 'departments',
                foreignKey: 'id',
                relatedKey: 'id'
            )

            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($employee) {
                return [
                    ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                    ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                    ['name' => 'access', 'icon' => 'Lock', 'label' => 'Access'],
                    ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                ];
            });
    }

    public function filterOptions(): array
    {
        return [
            'employmentInfo.employment_status' => $this->getStatusOptions(),
            'employmentInfo.department.name'   => $this->getDepartmentOptions(),
            'employmentInfo.position.title'    => $this->getPositionOptions(),
        ];
    }

    protected function getStatusOptions(): array
    {
        return collect(EmploymentStatus::cases())->map(function (EmploymentStatus $status) {
            return [
                'label' => Str::of($status->name)->replace('_', ' ')->lower()->ucfirst(),
                'value' => $status->value,
            ];
        })->all();
    }

    protected function getDepartmentOptions(): array
    {
        return Department::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn($dept) => [
                'id'    => $dept->id,
                'name'  => $dept->name,
                'value' => $dept->name,
            ])
            ->toArray();
    }

    protected function getPositionOptions(): array
    {
        return Position::query()
            ->select('id', 'title')
            ->orderBy('title')
            ->get()
            ->map(fn($position) => [
                'id'    => $position->id,
                'name'  => $position->title,
                'value' => $position->title,
            ])
            ->toArray();
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'employee';
    }
}

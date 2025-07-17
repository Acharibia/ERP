<?php
namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Models\Attendance;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class AttendanceDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder | QueryBuilder
    {
        return Attendance::query()->with(['employee.personalInfo', 'shift']);
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addRelationshipColumn('employee.personalInfo', 'name', 'Employee')
            ->addRelationshipColumn('shift', 'name', 'Shift')
            ->addColumn('attendance_date', 'Date')
            ->addColumn('clock_in', 'Clock In')
            ->addColumn('clock_out', 'Clock Out')
            ->addBadgeColumn('status', 'Status', [], [
                'present'  => 'success',
                'absent'   => 'destructive',
                'late'     => 'warning',
                'half-day' => 'secondary',
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($attendance) {
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
            // Example: 'status' => $this->getStatusOptions(),
        ];
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'attendance';
    }
}

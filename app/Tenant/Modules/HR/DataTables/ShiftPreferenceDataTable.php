<?php
namespace App\Tenant\Modules\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\Shift;
use App\Tenant\Modules\HR\Models\ShiftPreference;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class ShiftPreferenceDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder | QueryBuilder
    {
        $query = ShiftPreference::query()->with(['employee.personalInfo', 'shift']);
        return $query;
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addRelationshipColumn('employee.personalInfo', 'name', 'Employee')
            ->addRelationshipColumn('shift', 'name', 'Shift')
            ->addBadgeColumn('is_available', 'Available', [], [1 => 'success', 0 => 'secondary'])
            ->addColumn('preference_level', 'Preference Level')
            ->addBadgeColumn('is_mandatory', 'Mandatory', [], [1 => 'success', 0 => 'secondary'])
            ->addColumn('day_of_week', 'Day of Week')
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($preference) {
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
            'shift.name'                 => $this->getShiftOptions(),
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

    protected function getShiftOptions(): array
    {
        return Shift::all()
            ->map(fn($s) => [
                'id'    => $s->id,
                'name'  => $s->name,
                'value' => $s->name,
            ])
            ->toArray();
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'shiftPreference';
    }
}

<?php

namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\HR\Enum\LeaveRequestStatus;
use App\Tenant\HR\Enum\LeavePriority;
use App\Tenant\HR\Models\LeaveRequest;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class LeaveRequestDataTable extends AbstractDataTable
{
    /**
     * Query source of dataTable.
     */
    public function query(): EloquentBuilder|QueryBuilder
    {
        return LeaveRequest::with(['employee.personalInfo', 'leaveType']);
    }

    /**
     * Build DataTable class.
     */
    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible' => false,
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
                    'orderable' => true,
                ]
            )

            ->addRelationshipColumn(
                relationship: 'leaveType',
                field: 'name',
                title: 'Leave Type',
                relatedTable: 'leave_types',
                foreignKey: 'id',
                relatedKey: 'id',
                options: [
                    'searchable' => true,
                    'orderable' => true,
                ]
            )
            ->addDateColumn('start_date', 'Start Date', 'M j, Y', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addDateColumn('end_date', 'End Date', 'M j, Y', [
                'searchable' => true,
                'orderable' => true,
            ])
            ->addColumn('total_days', 'Days', [
                'orderable' => true,
                'className' => 'text-center',
            ])
            ->addBadgeColumn('status', 'Status', [], [
                LeaveRequestStatus::PENDING->value => [
                    'color' => 'secondary',
                    'icon' => 'Clock',
                ],
                LeaveRequestStatus::APPROVED->value => [
                    'color' => 'default',
                    'icon' => 'CheckCircle',
                ],
                LeaveRequestStatus::REJECTED->value => [
                    'color' => 'destructive',
                    'icon' => 'XCircle',
                ],
                LeaveRequestStatus::CANCELLED->value => [
                    'color' => 'outline',
                    'icon' => 'Slash',
                ],
                'default' => [
                    'color' => 'muted',
                    'icon' => 'HelpCircle',
                ],
            ])
            ->addBadgeColumn('priority', 'Priority', [], [
                LeavePriority::LOW->value => ['color' => 'muted', 'icon' => 'ArrowDown'],
                LeavePriority::NORMAL->value => ['color' => 'default', 'icon' => 'Move'],
                LeavePriority::HIGH->value => ['color' => 'warning', 'icon' => 'ArrowUp'],
                LeavePriority::URGENT->value => ['color' => 'destructive', 'icon' => 'AlertCircle'],
                'default' => ['color' => 'muted', 'icon' => 'HelpCircle'],
            ])
            ->addDateColumn('created_at', 'Date Applied', 'M j, Y g:i a', [
                'orderable' => true,
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($leave) {
                return match ($leave->status) {
                    LeaveRequestStatus::PENDING => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                        ['name' => 'approve', 'icon' => 'CheckCircle', 'label' => 'Approve'],
                        ['name' => 'reject', 'icon' => 'XCircle', 'label' => 'Reject'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    LeaveRequestStatus::APPROVED => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'cancel', 'icon' => 'Slash', 'label' => 'Cancel'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    LeaveRequestStatus::REJECTED, LeaveRequestStatus::CANCELLED => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                        ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                    ],
                    default => [
                        ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                    ],
                };
            });
    }

    /**
     * Get bulk actions for the DataTable.
     */
    public function bulkActions(): array
    {
        return [
            [
                'label' => 'Approve',
                'value' => 'approve',
                'icon' => 'CheckCircle',
                'variant' => 'success',
            ],
            [
                'label' => 'Reject',
                'value' => 'reject',
                'icon' => 'XCircle',
                'variant' => 'destructive',
            ],
            [
                'label' => 'Cancel',
                'value' => 'cancel',
                'icon' => 'Slash',
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
     */
    public function filterOptions(): array
    {
        return [
            'status' => $this->getStatusOptions(),
            'priority' => $this->getPriorityOptions(),
        ];
    }

    protected function getStatusOptions(): array
    {
        return collect(LeaveRequestStatus::cases())->map(fn($status) => [
            'label' => ucfirst(strtolower($status->name)),
            'value' => $status->value,
            'icon' => match ($status) {
                LeaveRequestStatus::PENDING => 'Clock',
                LeaveRequestStatus::APPROVED => 'CheckCircle',
                LeaveRequestStatus::REJECTED => 'XCircle',
                LeaveRequestStatus::CANCELLED => 'Slash',
            },
        ])->all();
    }

    protected function getPriorityOptions(): array
    {
        return collect(LeavePriority::cases())->map(fn($priority) => [
            'label' => ucfirst(strtolower($priority->name)),
            'value' => $priority->value,
            'icon' => match ($priority) {
                LeavePriority::LOW => 'ArrowDown',
                LeavePriority::NORMAL => 'Minus',
                LeavePriority::HIGH => 'ArrowUp',
                LeavePriority::URGENT => 'AlertCircle',
            },
        ])->all();
    }

    /**
     * Should the table include a select column?
     */
    public function hasSelectColumn(): bool
    {
        return true;
    }

    /**
     * Unique name of this DataTable.
     */
    public function name(): string
    {
        return 'leave_request';
    }
}

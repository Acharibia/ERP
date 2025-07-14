import { ChevronsLeft, Eye, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { LeaveType } from '@/types';

import CreateLeaveTypeDialog, { CreateLeaveTypeDialogRef } from './create-leave-type-dialog';
import DeleteLeaveTypeDialog, { DeleteLeaveTypeDialogRef } from './delete-leave-type-dialog';
import EditLeaveTypeDialog, { EditLeaveTypeDialogRef } from './edit-leave-type-dialog';
import ViewLeaveTypeDialog, { ViewLeaveTypeDialogRef } from './view-leave-type-dialog';

export default function LeaveTypes({ leaveTypes = [] }: { leaveTypes?: LeaveType[] }) {
    const createDialogRef = useRef<CreateLeaveTypeDialogRef>(null);
    const editDialogRef = useRef<EditLeaveTypeDialogRef>(null);
    const viewDialogRef = useRef<ViewLeaveTypeDialogRef>(null);
    const deleteDialogRef = useRef<DeleteLeaveTypeDialogRef>(null);

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <ChevronsLeft className="h-4 w-4" />
                        <span>Leave Types</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Leave Types</SheetTitle>
                        <SheetDescription>Manage the available leave types for employees.</SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 px-4">
                        {leaveTypes.length === 0 ? (
                            <p className="text-muted-foreground px-3 text-sm">No leave types available.</p>
                        ) : (
                            leaveTypes.map((type) => (
                                <div
                                    key={type.id}
                                    className="hover:bg-muted/40 border-primary bg-secondary flex items-start justify-between rounded border-l-1 py-2 pr-2 pl-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{type.name}</p>
                                        {type.description && <p className="text-muted-foreground text-sm">{type.description}</p>}
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="text-muted-foreground h-6 w-6">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                            <DropdownMenuItem onClick={() => viewDialogRef.current?.show(type)}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => editDialogRef.current?.show(type)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => deleteDialogRef.current?.show(type)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))
                        )}
                    </div>

                    <SheetFooter>
                        <Button
                            variant="default"
                            className="flex w-full items-center justify-center space-x-1"
                            onClick={() => createDialogRef.current?.show()}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Leave Type</span>
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <CreateLeaveTypeDialog ref={createDialogRef} />
            <EditLeaveTypeDialog ref={editDialogRef} />
            <ViewLeaveTypeDialog ref={viewDialogRef} />
            <DeleteLeaveTypeDialog ref={deleteDialogRef} />
        </>
    );
}

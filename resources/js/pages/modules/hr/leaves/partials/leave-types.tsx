import { ChevronsLeft, Eye, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { LeaveType } from '@/types';

import CreateLeaveTypeDialog, { CreateLeaveTypeDialogRef } from './create-leave-type-dialog';
import DeleteLeaveTypeDialog, { DeleteLeaveTypeDialogRef } from './delete-leave-type-dialog';
import EditLeaveTypeDialog, { EditLeaveTypeDialogRef } from './edit-leave-type-dialog';
import ViewLeaveTypeDialog, { ViewLeaveTypeDialogRef } from './view-leave-type-dialog';

const ITEMS_PER_PAGE = 8;

export default function LeaveTypes({ leaveTypes = [] }: { leaveTypes?: LeaveType[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(leaveTypes.length / ITEMS_PER_PAGE);

    const createDialogRef = useRef<CreateLeaveTypeDialogRef>(null);
    const editDialogRef = useRef<EditLeaveTypeDialogRef>(null);
    const viewDialogRef = useRef<ViewLeaveTypeDialogRef>(null);
    const deleteDialogRef = useRef<DeleteLeaveTypeDialogRef>(null);

    const paginatedLeaveTypes = leaveTypes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                        <Button
                            variant="default"
                            className="flex w-full items-center justify-center space-x-1"
                            onClick={() => createDialogRef.current?.show()}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Leave Type</span>
                        </Button>
                    </SheetHeader>

                    <ScrollArea className="h-[calc(100vh-200px)] px-4">
                        <div className="grid gap-4 pb-4">
                            {leaveTypes.length === 0 ? (
                                <p className="text-muted-foreground px-3 text-sm">No leave types available.</p>
                            ) : (
                                paginatedLeaveTypes.map((type) => (
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
                    </ScrollArea>
                    <SheetFooter className="mt-0 pt-0">
                        {totalPages > 1 && (
                            <div className="px-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious onClick={() => goToPage(currentPage - 1)} href="#" />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink href="#" isActive={page === currentPage} onClick={() => goToPage(page)}>
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {totalPages > 5 && currentPage < totalPages - 2 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}

                                        <PaginationItem>
                                            <PaginationNext onClick={() => goToPage(currentPage + 1)} href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
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

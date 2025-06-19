import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { LeaveType } from '@/types';
import { Calendar, CheckCircle, Clock, Edit, Plus, Settings2, Shield, Trash2, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

interface LeaveTypesSheetProps {
    isOpen: boolean;
    onClose: () => void;
    leaveTypes: LeaveType[];
}

export function LeaveTypesSheet({ isOpen, onClose, leaveTypes }: LeaveTypesSheetProps) {
    const [localLeaveTypes, setLocalLeaveTypes] = useState(leaveTypes);
    const isMobile = useIsMobile();

    const handleToggleActive = (id: number) => {
        setLocalLeaveTypes((prev) => prev.map((type) => (type.id === id ? { ...type, isActive: !type.isActive } : type)));
    };

    const handleEditLeaveType = (id: number) => {
        console.log(`Edit leave type ${id}`);
    };

    const handleAddLeaveType = () => {
        console.log('Add new leave type');
    };

    const handleDeleteLeaveType = (id: number) => {
        console.log(`Delete leave type ${id}`);
        if (confirm('Are you sure you want to delete this leave type?')) {
            setLocalLeaveTypes((prev) => prev.filter((type) => type.id !== id));
        }
    };

    return (
        <TooltipProvider>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className={isMobile ? 'w-full' : 'w-[440px]'}>
                    <SheetHeader className={isMobile ? 'pb-4' : 'pb-6'}>
                        <div className="flex items-center gap-2">
                            <Settings2 className="text-primary h-5 w-5" />
                            <SheetTitle className={isMobile ? 'text-base' : 'text-lg'}>Leave Types</SheetTitle>
                        </div>
                        <SheetDescription className={isMobile ? 'text-xs' : 'text-sm'}>
                            {isMobile
                                ? 'Configure leave policies for your organization.'
                                : 'Configure leave policies and entitlements for your organization.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className={`space-y-${isMobile ? '3' : '4'} ${isMobile ? 'px-2' : 'px-4'}`}>
                        {/* Add Button */}
                        <Button onClick={handleAddLeaveType} size="sm" className={`w-full gap-2 ${isMobile ? 'h-8' : 'h-9'}`}>
                            <Plus className="h-4 w-4" />
                            {isMobile ? 'Add Leave Type' : 'Add New Leave Type'}
                        </Button>

                        {/* Leave Types List */}
                        <div
                            className={`max-h-[calc(100vh-${isMobile ? '160px' : '180px'})] space-y-${isMobile ? '2' : '3'} overflow-y-auto ${isMobile ? 'pr-1' : 'pr-2'}`}
                        >
                            {localLeaveTypes.map((leaveType) => (
                                <div
                                    key={leaveType.id}
                                    className={`group rounded-lg border transition-all duration-200 hover:shadow-md ${
                                        leaveType.isActive
                                            ? 'bg-card border-border hover:border-primary/20'
                                            : 'bg-muted/30 border-muted-foreground/20'
                                    }`}
                                >
                                    {/* Header */}
                                    <div className={`flex items-start justify-between ${isMobile ? 'p-3 pb-2' : 'p-4 pb-3'}`}>
                                        <div className="flex min-w-0 flex-1 items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h4 className={`text-foreground truncate font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                                    {leaveType.name}
                                                </h4>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge
                                                        variant={leaveType.isActive ? 'default' : 'secondary'}
                                                        className={`px-2 py-0.5 ${isMobile ? 'h-4 text-xs' : 'h-5 text-xs'}`}
                                                    >
                                                        {leaveType.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {!isMobile ? (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditLeaveType(leaveType.id)}
                                                                className="h-4 w-4 p-0 opacity-60 transition-opacity group-hover:opacity-100"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit leave type</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteLeaveType(leaveType.id)}
                                                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-7 w-4 p-0 opacity-60 transition-opacity group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete leave type</TooltipContent>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditLeaveType(leaveType.id)}
                                                        className="h-4 w-4 p-0"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteLeaveType(leaveType.id)}
                                                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}

                                            <div>
                                                {!isMobile ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div>
                                                                <Switch
                                                                    checked={leaveType.isActive}
                                                                    onCheckedChange={() => handleToggleActive(leaveType.id)}
                                                                    className="scale-70"
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{leaveType.isActive ? 'Deactivate' : 'Activate'} leave type</TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Switch
                                                        checked={leaveType.isActive}
                                                        onCheckedChange={() => handleToggleActive(leaveType.id)}
                                                        className="scale-90"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Configuration Details */}
                                    <div className={isMobile ? 'px-3 pb-3' : 'px-4 pb-4'}>
                                        <div className={`grid grid-cols-3 gap-${isMobile ? '2' : '4'} ${isMobile ? 'text-xs' : 'text-xs'}`}>
                                            {/* Max Days */}
                                            <div className={`flex flex-col items-center rounded-md border ${isMobile ? 'p-1.5' : 'p-2'}`}>
                                                <Clock className={`text-muted-foreground mb-1 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                                <span className="text-muted-foreground">Max Days</span>
                                                <span className="text-foreground mt-1 font-semibold">{leaveType.maxDays || '∞'}</span>
                                            </div>

                                            {/* Approval */}
                                            <div className={`flex flex-col items-center rounded-md border ${isMobile ? 'p-1.5' : 'p-2'}`}>
                                                {leaveType.requiresApproval ? (
                                                    <>
                                                        <Shield className={`mb-1 text-amber-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                                        <span className="text-muted-foreground">{isMobile ? 'Approval' : 'Approval'}</span>
                                                        <span className="mt-1 font-semibold text-amber-700 dark:text-amber-300">
                                                            {isMobile ? 'Req' : 'Required'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className={`mb-1 text-emerald-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                                        <span className="text-muted-foreground">{isMobile ? 'Approval' : 'Approval'}</span>
                                                        <span className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300">Auto</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Carry Over */}
                                            <div className={`flex flex-col items-center rounded-md border ${isMobile ? 'p-1.5' : 'p-2'}`}>
                                                {leaveType.carryOver ? (
                                                    <>
                                                        <TrendingUp className={`mb-1 text-blue-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                                        <span className="text-muted-foreground">{isMobile ? 'Carry' : 'Carry Over'}</span>
                                                        <span className="mt-1 font-semibold text-blue-700 dark:text-blue-300">Yes</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className={`mb-1 text-red-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                                        <span className="text-muted-foreground">{isMobile ? 'Carry' : 'Carry Over'}</span>
                                                        <span className="mt-1 font-semibold text-red-700 dark:text-red-300">No</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {leaveType.description && (
                                            <div className={`border-border/50 border-t ${isMobile ? 'mt-2 pt-2' : 'mt-3 pt-3'}`}>
                                                <p
                                                    className={`text-muted-foreground line-clamp-2 leading-relaxed ${isMobile ? 'text-xs' : 'text-xs'}`}
                                                >
                                                    {leaveType.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {localLeaveTypes.length === 0 && (
                                <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
                                    <div
                                        className={`bg-muted/50 mx-auto mb-4 flex items-center justify-center rounded-full ${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}
                                    >
                                        <Calendar className={`text-muted-foreground/50 ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
                                    </div>
                                    <h3 className={`text-foreground mb-2 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                        No leave types configured
                                    </h3>
                                    <p className={`text-muted-foreground mx-auto mb-4 max-w-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {isMobile
                                            ? 'Create your first leave type to start managing time off.'
                                            : 'Create your first leave type to start managing employee time off requests.'}
                                    </p>
                                    <Button onClick={handleAddLeaveType} size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        {isMobile ? 'Create Type' : 'Create Leave Type'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </TooltipProvider>
    );
}

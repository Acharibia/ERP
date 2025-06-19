import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Department } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Calendar, DollarSign, Edit3, Hash, Mail, MapPin, MoreVertical, Trash2, TrendingUp, UserCheck, Users } from 'lucide-react';

interface ShowProps {
    department: Department;
}

export default function Show({ department }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/modules/hr/dashboard',
        },
        {
            title: 'Departments',
            href: '/modules/hr/departments',
        },
        {
            title: department.name,
            href: `/modules/hr/departments/${department.id}`,
        },
    ];

    const handleEdit = () => {
        router.visit(route('modules.hr.departments.edit', { id: department.id }));
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the ${department.name} department?`)) {
            router.delete(route('modules.hr.departments.destroy', { id: department.id }));
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return 'Not set';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={department.name} />

            <PageHeader
                title={department.name}
                description="Department details and organizational information"
                action={
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit Department
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Department
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
            />

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Status and Quick Info */}
                    <div className="flex items-center gap-4">
                        {department.code && (
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Hash className="h-4 w-4" />
                                {department.code}
                            </div>
                        )}
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {department.employee_count || 0} employees
                        </div>
                    </div>

                    {/* Main Information Cards - All in One Row */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <dt className="text-muted-foreground text-sm font-medium">Department Name</dt>
                                        <dd className="text-lg font-semibold">{department.name}</dd>
                                    </div>

                                    {department.email && (
                                        <div>
                                            <dt className="text-muted-foreground text-sm font-medium">Email</dt>
                                            <dd className="flex items-center gap-2">
                                                <Mail className="text-muted-foreground h-4 w-4" />
                                                <a href={`mailto:${department.email}`} className="text-blue-600 hover:underline">
                                                    {department.email}
                                                </a>
                                            </dd>
                                        </div>
                                    )}

                                    {department.description && (
                                        <div>
                                            <dt className="text-muted-foreground text-sm font-medium">Description</dt>
                                            <dd className="text-sm leading-relaxed">{department.description}</dd>
                                        </div>
                                    )}

                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <dt className="text-muted-foreground text-sm font-medium">Created</dt>
                                            <dd className="flex items-center gap-1 text-sm">
                                                <Calendar className="text-muted-foreground h-4 w-4" />
                                                {formatDate(department.created_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground text-sm font-medium">Status</dt>
                                            <dd>
                                                <Badge className={getStatusColor(department.status)} variant="outline">
                                                    {department.status}
                                                </Badge>
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Management & Structure */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    Management & Structure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {department.manager ? (
                                    <div>
                                        <dt className="text-muted-foreground mb-2 text-sm font-medium">Department Manager</dt>
                                        <dd className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="" />
                                                <AvatarFallback className="text-xs">{getInitials(department.manager.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{department.manager.name}</div>
                                                <div className="text-muted-foreground text-sm">Department Manager</div>
                                            </div>
                                        </dd>
                                    </div>
                                ) : (
                                    <div>
                                        <dt className="text-muted-foreground text-sm font-medium">Department Manager</dt>
                                        <dd className="text-muted-foreground text-sm">No manager assigned</dd>
                                    </div>
                                )}

                                {department.parent ? (
                                    <div>
                                        <dt className="text-muted-foreground mb-2 text-sm font-medium">Parent Department</dt>
                                        <dd>
                                            <Link
                                                href={route('modules.hr.departments.show', { id: department.parent.id })}
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                <Building2 className="h-4 w-4" />
                                                {department.parent.name}
                                            </Link>
                                        </dd>
                                    </div>
                                ) : (
                                    <div>
                                        <dt className="text-muted-foreground text-sm font-medium">Parent Department</dt>
                                        <dd className="text-muted-foreground text-sm">Top-level department</dd>
                                    </div>
                                )}

                                {department.children && department.children.length > 0 && (
                                    <div>
                                        <dt className="text-muted-foreground mb-2 text-sm font-medium">Sub-departments</dt>
                                        <dd className="space-y-1">
                                            {department.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={route('modules.hr.departments.show', { id: child.id })}
                                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                                >
                                                    <Building2 className="h-3 w-3" />
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </dd>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Operations & Budget */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Operations & Budget
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <dt className="text-muted-foreground mb-1 text-sm font-medium">Location</dt>
                                    <dd className="flex items-center gap-2">
                                        <MapPin className="text-muted-foreground h-4 w-4" />
                                        <span>{department.location || 'Not specified'}</span>
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1 text-sm font-medium">Annual Budget</dt>
                                    <dd className="flex items-center gap-2">
                                        <DollarSign className="text-muted-foreground h-4 w-4" />
                                        <span className="font-medium">{formatCurrency(department.budget)}</span>
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1 text-sm font-medium">Cost Center</dt>
                                    <dd className="flex items-center gap-2">
                                        <Hash className="text-muted-foreground h-4 w-4" />
                                        <span>{department.cost_center || 'Not assigned'}</span>
                                    </dd>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Metrics (if available) */}
                    {(department.budget_utilized !== undefined || department.performance) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {department.budget_utilized !== undefined && (
                                        <div>
                                            <dt className="text-muted-foreground mb-1 text-sm font-medium">Budget Utilized</dt>
                                            <dd className="text-lg font-semibold">{department.budget_utilized}%</dd>
                                        </div>
                                    )}

                                    {department.performance && (
                                        <div>
                                            <dt className="text-muted-foreground mb-1 text-sm font-medium">Performance</dt>
                                            <dd>
                                                <Badge variant="outline">{department.performance}</Badge>
                                            </dd>
                                        </div>
                                    )}

                                    {department.open_positions !== undefined && (
                                        <div>
                                            <dt className="text-muted-foreground mb-1 text-sm font-medium">Open Positions</dt>
                                            <dd className="text-lg font-semibold">{department.open_positions}</dd>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="employees" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Department Employees
                            </CardTitle>
                            <CardDescription>{department.employee_count || 0} employees in this department</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {department.employees && department.employees.length > 0 ? (
                                <div className="space-y-4">
                                    {department.employees.map((employee) => (
                                        <div key={employee.id} className="flex items-center gap-3 rounded-lg border p-3">
                                            <Avatar>
                                                <AvatarImage src="" />
                                                <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="font-medium">{employee.name}</div>
                                                <div className="text-muted-foreground text-sm">{employee.email || 'No email provided'}</div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                View Profile
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <h3 className="mb-2 text-lg font-medium">No employees assigned</h3>
                                    <p className="text-muted-foreground mb-4">This department doesn't have any employees assigned yet.</p>
                                    <Button variant="outline">Add Employees</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="structure" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Organizational Structure
                            </CardTitle>
                            <CardDescription>Department hierarchy and relationships</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Parent Department */}
                            {department.parent && (
                                <div>
                                    <h4 className="mb-3 font-medium">Parent Department</h4>
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="text-muted-foreground h-8 w-8" />
                                            <div>
                                                <Link
                                                    href={route('modules.hr.departments.show', { id: department.parent.id })}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {department.parent.name}
                                                </Link>
                                                <div className="text-muted-foreground text-sm">
                                                    {department.parent.description || 'No description'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Current Department */}
                            <div>
                                <h4 className="mb-3 font-medium">Current Department</h4>
                                <div className="bg-muted/30 rounded-lg border p-4">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="text-primary h-8 w-8" />
                                        <div>
                                            <div className="font-medium">{department.name}</div>
                                            <div className="text-muted-foreground text-sm">{department.description || 'No description'}</div>
                                            <div className="text-muted-foreground text-sm">{department.employee_count || 0} employees</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sub-departments */}
                            {department.children && department.children.length > 0 && (
                                <div>
                                    <h4 className="mb-3 font-medium">Sub-departments</h4>
                                    <div className="space-y-3">
                                        {department.children.map((child) => (
                                            <div key={child.id} className="rounded-lg border p-4">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="text-muted-foreground h-8 w-8" />
                                                    <div className="flex-1">
                                                        <Link
                                                            href={route('modules.hr.departments.show', { id: child.id })}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                        <div className="text-muted-foreground text-sm">{child.description || 'No description'}</div>
                                                    </div>
                                                    <Badge variant="outline">{child.status}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!department.parent && (!department.children || department.children.length === 0) && (
                                <div className="py-8 text-center">
                                    <Building2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <h3 className="mb-2 text-lg font-medium">Standalone Department</h3>
                                    <p className="text-muted-foreground">
                                        This department operates independently without parent or child departments.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}

import { Link } from '@inertiajs/react';
import { BarChart3, Briefcase, Building, ClipboardList, CreditCard, Database, Settings, Users } from 'lucide-react';
import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import SelectionLayout from '@/layouts/access-layout';

type ModuleType = 'core' | 'hr' | 'inventory' | 'crm' | 'accounting';

interface ModuleInfo {
    icon: ReactNode;
    displayName: string;
    description: string;
}

interface AccessType {
    type: 'admin' | 'reseller' | 'module';
    id?: number;
    code?: ModuleType;
    name: string;
    description: string;
    route: string;
}

interface AccessSelectionProps {
    business: {
        id: number;
        name: string;
    };
    accessTypes: AccessType[];
}

export default function AccessSelection({ business, accessTypes }: AccessSelectionProps) {
    // Module configuration with icons and display names
    const moduleConfig: Record<ModuleType, ModuleInfo> = {
        core: {
            icon: <Database className="h-5 w-5" />,
            displayName: 'Core',
            description: 'Core system functionality',
        },
        hr: {
            icon: <Users className="h-5 w-5" />,
            displayName: 'Human Resources',
            description: 'Employee management, attendance, and payroll',
        },
        inventory: {
            icon: <ClipboardList className="h-5 w-5" />,
            displayName: 'Inventory',
            description: 'Stock management and warehouse operations',
        },
        crm: {
            icon: <Building className="h-5 w-5" />,
            displayName: 'CRM',
            description: 'Customer relationship management',
        },
        accounting: {
            icon: <CreditCard className="h-5 w-5" />,
            displayName: 'Accounting',
            description: 'Financial management and reporting',
        },
    };

    // Get icon based on access type
    const getIcon = (access: AccessType): ReactNode => {
        if (access.type === 'admin') return <Settings className="h-5 w-5" />;
        if (access.type === 'reseller') return <Briefcase className="h-5 w-5" />;
        if (access.type === 'module' && access.code && moduleConfig[access.code]) {
            return moduleConfig[access.code].icon;
        }
        return <BarChart3 className="h-5 w-5" />;
    };

    // Get display name based on access type
    const getDisplayName = (access: AccessType): string => {
        if (access.type === 'admin') return 'Admin Dashboard';
        if (access.type === 'reseller') return 'Reseller Dashboard';
        if (access.type === 'module' && access.code && moduleConfig[access.code]) {
            return moduleConfig[access.code].displayName;
        }
        return access.name;
    };

    return (
        <SelectionLayout title="Select Access" description="Choose how to access this business" businessName={business.name}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {accessTypes.map((access, index) => (
                    <Link
                        key={index}
                        href={route('access.select')}
                        method="post"
                        data={{
                            access_type: access.type,
                            module_id: access.id || null,
                        }}
                        className="block h-full"
                    >
                        <Card className="hover:border-primary/50 hover:bg-primary/5 h-full cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="flex h-full flex-col p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-primary/10 text-primary mb-4 rounded-lg p-3">{getIcon(access)}</div>
                                    <div>
                                        <h3 className="text-base font-semibold">{getDisplayName(access)}</h3>
                                        <p className="text-muted-foreground mt-1.5 text-sm">{access.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </SelectionLayout>
    );
}

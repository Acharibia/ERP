import { ApprovalsCard } from '@/components/hr/approvals-card';
import { CardWidget } from '@/components/hr/card-widget';
import { DepartmentDistribution } from '@/components/hr/department-distribution';
import { EmployeeOverview } from '@/components/hr/employee-overview';
import { PerformanceRatings } from '@/components/hr/performance-ratings';
import { QuickActionsCard } from '@/components/hr/quick-actions-card';
import { UpcomingEventsCard } from '@/components/hr/upcoming-events-card';
import { WelcomeCard } from '@/components/hr/welcome-card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, Briefcase, Calendar, Clock, GraduationCap, Plus, TrendingDown, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/hr/dashboard',
    },
];

export default function Dashboard() {
    const employeeGrowthData = [220, 225, 235, 240, 245, 248];
    const attendanceData = [94, 95, 96, 95, 96.5, 96.5];
    const turnoverData = [5.8, 5.2, 4.8, 4.5, 4.3, 4.2];

    const handleQuickAction = (action: string) => {
        console.log(`Quick action: ${action}`);
        // TODO: Implement actual navigation/action logic
        switch (action) {
            case 'reports':
                break;
            case 'calendar':
                break;
            case 'add':
                break;
            case 'onboarding':
                break;
            case 'reviews':
                break;
            case 'training':
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
    };

    const handleApprovalAction = (action: string, id?: string) => {
        console.log(`Approval action: ${action}`, id ? `for ID: ${id}` : '');
        // TODO: Implement actual approval logic
        switch (action) {
            case 'viewAll':
                // Navigate to approvals page
                break;
            case 'approve':
                // Approve specific item
                break;
            case 'review':
                // Open review modal or navigate to review page
                break;
            default:
                console.warn(`Unknown approval action: ${action}`);
        }
    };

    const handleEventAction = (action: string, id?: string) => {
        console.log(`Event action: ${action}`, id ? `for ID: ${id}` : '');
        // TODO: Implement actual event logic
        switch (action) {
            case 'viewCalendar':
                // Navigate to calendar page
                break;
            case 'viewEvent':
                // Open event details
                break;
            case 'markComplete':
                // Mark event as complete
                break;
            default:
                console.warn(`Unknown event action: ${action}`);
        }
    };

    const getCurrentPeriod = () => {
        const now = new Date();
        const month = now.toLocaleDateString('en-US', { month: 'long' });
        const year = now.getFullYear();
        return `${month} ${year}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl">
                {/* Dashboard Header */}
                <div className="space-y-4">
                    <PageHeader title="HR Dashboard" description={`Overview of human resources metrics and activities for ${getCurrentPeriod()}`}>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleQuickAction('reports')}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Reports
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleQuickAction('calendar')}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Calendar
                            </Button>
                            <Button size="sm" onClick={() => handleQuickAction('add')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Quick Add
                            </Button>
                        </div>
                    </PageHeader>

                    {/* Welcome Section */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <WelcomeCard />
                        <QuickActionsCard onQuickAction={handleQuickAction} />
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                    <CardWidget
                        title="Total Employees"
                        value="248"
                        description="+12 new hires this month"
                        trend="positive"
                        icon={Users}
                        href="/hr/employees"
                        showSparkline={true}
                        sparklineData={employeeGrowthData}
                    />
                    <CardWidget
                        title="New Hires"
                        value="12"
                        description="+45% from last month"
                        trend="positive"
                        icon={UserPlus}
                        href="/hr/recruitment"
                    />
                    <CardWidget
                        title="Attendance Rate"
                        value="96.5%"
                        description="+2.1% from last month"
                        trend="positive"
                        icon={Clock}
                        href="/hr/attendance"
                        showSparkline={true}
                        sparklineData={attendanceData}
                    />
                    <CardWidget
                        title="Open Positions"
                        value="7"
                        description="3 urgent positions"
                        trend="neutral"
                        icon={Briefcase}
                        href="/hr/positions"
                    />
                    <CardWidget
                        title="Turnover Rate"
                        value="4.2%"
                        description="-1.3% from last month"
                        trend="positive"
                        icon={TrendingDown}
                        href="/hr/analytics/turnover"
                        showSparkline={true}
                        sparklineData={turnoverData}
                    />
                    <CardWidget
                        title="Training Completed"
                        value="89%"
                        description="156 employees certified"
                        trend="positive"
                        icon={GraduationCap}
                        href="/hr/training"
                    />
                </div>

                {/* Analytics Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-9">
                    <div className="col-span-3">
                        <EmployeeOverview />
                    </div>
                    <div className="col-span-3">
                        <DepartmentDistribution />
                    </div>
                    <div className="col-span-3">
                        <PerformanceRatings />
                    </div>
                </div>

                {/* Action Cards Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    <ApprovalsCard
                        onViewAll={() => handleApprovalAction('viewAll')}
                        onApprove={(id) => handleApprovalAction('approve', id)}
                        onReview={(id) => handleApprovalAction('review', id)}
                    />
                    <UpcomingEventsCard
                        onViewCalendar={() => handleEventAction('viewCalendar')}
                        onViewEvent={(id) => handleEventAction('viewEvent', id)}
                        onMarkComplete={(id) => handleEventAction('markComplete', id)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

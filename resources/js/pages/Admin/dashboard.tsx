'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ArrowUpRight, BarChart3, Building, Clock, Package, Server, ShieldAlert, TrendingUp, Users } from 'lucide-react';

// Import chart components
import BusinessHealthChart from '@/components/admin/business-health-chart';
import OverviewChart from '@/components/admin/overview-chart';
import RecentSalesChart from '@/components/admin/recent-sales-chart';
import RecentSubscriptionChart from '@/components/admin/recent-subscriptions-chart';
import RecentTransactions from '@/components/admin/recent-transactions';

// Import new business tab charts
import BusinessGrowthChart from '@/components/admin/business-growth-chart';
import BusinessRetentionChart from '@/components/admin/business-retention-chart';
import IndustryDistributionChart from '@/components/admin/industry-distribution-chart';
import ModuleAdoptionChart from '@/components/admin/module-adoption-chart';
import SubscriptionDistributionChart from '@/components/admin/subscription-distribution-chart';

// Import charts for Modules tab
import ModuleUserEngagementChart from '@/components/admin/module-user-engagement-chart';
import ModuleUsageTrendChart from '@/components/admin/modules-usage-trend-chart';
import ModuleRevenueContributionChart from '@/components/admin/module-revenue-contribution-chart';
import ModuleImplementationSuccessChart from '@/components/admin/module-implementation-success-rate-chart';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="business">Business</TabsTrigger>
                        <TabsTrigger value="modules">Modules</TabsTrigger>
                        <TabsTrigger value="resellers">Resellers</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        {/* Stats Overview Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <BarChart3 className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$845,231.89</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +20.1% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Building className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,238</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +6.5% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Users className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">142</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +3.4% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Package className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">99.98%</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="ml-0">Last 30 days</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts for overview tab */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                            <OverviewChart />
                            <RecentSalesChart />
                            <RecentTransactions />
                            <RecentSubscriptionChart />
                        </div>
                    </TabsContent>

                    {/* Business Tab */}
                    <TabsContent value="business" className="space-y-4">
                        {/* Stats cards for business tab */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Net Growth</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <TrendingUp className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+583</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +19.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last year</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Users className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">96.3%</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +1.8% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last year</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Revenue</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <BarChart3 className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$682.75</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +4.5% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">per business</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Users className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">17,863</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +12.3% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* First row of business charts */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                            <BusinessGrowthChart className="col-span-12 lg:col-span-6" />
                            <SubscriptionDistributionChart className="col-span-12 lg:col-span-6" />
                        </div>

                        {/* Second row of business charts */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                            <BusinessRetentionChart className="col-span-12 lg:col-span-6" />
                            <IndustryDistributionChart className="col-span-12 lg:col-span-6" />
                        </div>

                        {/* Third row of business charts */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                            <BusinessHealthChart />
                            <ModuleAdoptionChart className="col-span-12 lg:col-span-8" />
                        </div>
                    </TabsContent>

                    {/* Modules Tab */}
                    <TabsContent value="modules" className="space-y-4">
                        {/* Stats cards for modules tab */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Module Revenue</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <BarChart3 className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$845,232</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            +15.3% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last quarter</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Clock className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">102ms</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            -5.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">improved response</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <ShieldAlert className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0.15%</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            -0.03% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="gap-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Server className="text-primary h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">32.4%</div>
                                    <div className="text-muted-foreground flex items-center pt-1 text-xs">
                                        <span className="flex items-center text-green-500">
                                            -2.1% <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </span>
                                        <span className="ml-2">avg CPU usage</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* First row of module charts */}
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
                            <ModuleUsageTrendChart className='col-span-6' />
                            <ModuleUserEngagementChart className="col-span-12 lg:col-span-6" />
                            <ModuleRevenueContributionChart className="col-span-12 lg:col-span-6" />
                            <ModuleImplementationSuccessChart className="col-span-12 lg:col-span-6" />
                        </div>

                    </TabsContent>

                    {/* Resellers Tab */}
                    <TabsContent value="resellers" className="space-y-4">
                        {/* Stats cards for resellers tab */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Reseller-specific stat cards */}</div>

                        {/* Placeholder for reseller chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reseller Performance</CardTitle>
                                <CardDescription>Revenue and client distribution across resellers</CardDescription>
                            </CardHeader>
                            <CardContent className="text-muted-foreground flex h-[400px] items-center justify-center">
                                <div className="text-center">
                                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <h3 className="mb-2 text-lg font-medium">Reseller analytics coming soon</h3>
                                    <p>We're currently collecting and processing reseller performance data.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

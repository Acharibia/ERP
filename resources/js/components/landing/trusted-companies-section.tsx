// Trusted companies section with Lucide icons
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Briefcase, Building2, Database, LineChart, Share2 } from 'lucide-react';

export const TrustedCompaniesSection = () => {
    // Define company data with icons, names and optional color
    const companies = [
        {
            name: 'TechCorp',
            icon: Building2,
            color: '#4285F4',
        },
        {
            name: 'DataSystems',
            icon: Database,
            color: '#34A853',
        },
        {
            name: 'GrowthMetrics',
            icon: BarChart3,
            color: '#EA4335',
        },
        {
            name: 'EnterprisePro',
            icon: Briefcase,
            color: '#FBBC05',
        },
        {
            name: 'ConnectShare',
            icon: Share2,
            color: '#1DA1F2',
        },
        {
            name: 'AnalyticsCo',
            icon: LineChart,
            color: '#6200EA',
        },
    ];

    return (
        <div className="relative z-10 container mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8">
            <div className="text-center">
                <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">Trusted by leading companies</p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                    {companies.map((company, i) => (
                        <div key={i} className="group flex flex-col items-center">
                            <Card className="group-hover:border-primary/20 flex h-16 w-28 flex-col items-center justify-center transition-all duration-200 group-hover:shadow-md">
                                <CardContent className="flex h-full w-full flex-col items-center justify-center p-3">
                                    {/* Icon with company's color on hover */}
                                    <company.icon
                                        className="group-hover:text-primary text-muted-foreground h-8 w-8 transition-colors"
                                        color={`currentColor`}
                                    />
                                    <span className="group-hover:text-primary text-muted-foreground mt-1 text-xs font-medium transition-colors">
                                        {company.name}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-sm">
                    Join hundreds of organizations already using our ERP solution to streamline their operations and drive growth
                </p>
            </div>
        </div>
    );
};

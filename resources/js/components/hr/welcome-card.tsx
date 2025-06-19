import { Card } from '@/components/ui/card';

export function WelcomeCard() {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const getDateString = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card className="p-6 transition-shadow duration-200">
            <div className="flex items-start justify-between gap-6">
                {/* Left Content */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div>
                        <h2 className="text-foreground text-xl leading-tight font-semibold">{getGreeting()}, Sarah! 👋</h2>
                        <p className="text-muted-foreground mt-1 text-sm">{getDateString()}</p>
                    </div>

                    {/* Quick Summary */}
                    <div className="space-y-2.5">
                        <div className="group flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 transition-transform duration-200 group-hover:scale-110"></div>
                            <span className="text-foreground text-sm">5 tasks pending</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 transition-transform duration-200 group-hover:scale-110"></div>
                            <span className="text-foreground text-sm">12% satisfaction up</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-amber-500 transition-transform duration-200 group-hover:scale-110"></div>
                            <span className="text-foreground text-sm">2 urgent approvals</span>
                        </div>
                    </div>
                </div>

                {/* HR Illustration */}
                <div className="w-28 flex-shrink-0 sm:w-36">
                    <div className="relative rounded-lg">
                        <img
                            src="/assets/images/illustrations/illustration1.png"
                            alt="HR Dashboard Illustration"
                            className="h-24 w-full rounded-md object-cover sm:h-32"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}

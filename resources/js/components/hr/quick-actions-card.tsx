import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface QuickActionsCardProps {
    onQuickAction: (action: string) => void;
}

export function QuickActionsCard({ onQuickAction }: QuickActionsCardProps) {
    return (
        <Card className="p-4 transition-shadow duration-200 hover:shadow-md">
            <div className="space-y-3">
                <div>
                    <h3 className="text-foreground text-sm font-medium">Quick Actions</h3>
                    <p className="text-muted-foreground text-xs">Common HR tasks</p>
                </div>

                <div className="space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent h-8 w-full justify-between text-xs transition-colors sm:text-sm"
                        onClick={() => onQuickAction('onboarding')}
                    >
                        Complete Onboarding (3)
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent h-8 w-full justify-between text-xs transition-colors sm:text-sm"
                        onClick={() => onQuickAction('reviews')}
                    >
                        Schedule Reviews (5)
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent h-8 w-full justify-between text-xs transition-colors sm:text-sm"
                        onClick={() => onQuickAction('training')}
                    >
                        Assign Training (12)
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

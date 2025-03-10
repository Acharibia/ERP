import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MenuSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LAYOUT_STORAGE_KEY, useAppLayout, type AppLayoutType } from './app-layout-provider';

export function LayoutSelector() {
    const { layout, setLayout } = useAppLayout();
    const [selectedLayout, setSelectedLayout] = useState<AppLayoutType>(layout);

    useEffect(() => {
        setSelectedLayout(layout);
    }, [layout]);

    const changeLayout = (newLayout: AppLayoutType) => {
        if (newLayout === selectedLayout) return;

        setSelectedLayout(newLayout);
        setLayout(newLayout);

        // Save to localStorage
        localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout);

        // Give UI time to update before reload
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    return (
        <Card className="mb-4 rounded-lg border">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Layout</CardTitle>
                <CardDescription>Choose your preferred application layout</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Layout</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => changeLayout('sidebar')}
                            variant="outline"
                            className={cn(
                                'flex h-24 flex-col items-center justify-center border-2 p-0',
                                selectedLayout === 'sidebar' ? 'border-primary' : 'border-transparent',
                            )}
                        >
                            <div className="flex h-full w-full">
                                <div className="bg-muted flex h-full w-1/4 items-center justify-center border-r">
                                    <MenuSquare className="text-muted-foreground h-5 w-5" />
                                </div>
                                <div className="w-3/4 p-2">
                                    <div className="bg-muted mb-2 h-3 w-full rounded-sm" />
                                    <div className="bg-muted h-3 w-2/3 rounded-sm" />
                                    <div className="bg-muted mt-2 h-3 w-3/4 rounded-sm" />
                                </div>
                            </div>
                            <span className="mt-2 block text-xs font-medium">Sidebar</span>
                        </Button>

                        <Button
                            onClick={() => changeLayout('header')}
                            variant="outline"
                            className={cn(
                                'flex h-24 flex-col items-center justify-center border-2 p-0',
                                selectedLayout === 'header' ? 'border-primary' : 'border-transparent',
                            )}
                        >
                            <div className="flex h-full w-full flex-col">
                                <div className="bg-muted flex h-1/4 w-full items-center justify-between border-b px-2">
                                    <div className="bg-background h-2 w-1/3 rounded-sm" />
                                    <LayoutDashboard className="text-muted-foreground h-4 w-4" />
                                </div>
                                <div className="flex-1 p-2">
                                    <div className="bg-muted mb-2 h-3 w-full rounded-sm" />
                                    <div className="bg-muted h-3 w-2/3 rounded-sm" />
                                    <div className="bg-muted mt-2 h-3 w-3/4 rounded-sm" />
                                </div>
                            </div>
                            <span className="mt-2 block text-xs font-medium">Header</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

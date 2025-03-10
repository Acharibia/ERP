import { Check, Moon, Repeat, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ThemeColor {
    name: string;
    label: string;
    activeColor: {
        light: string;
        dark: string;
    };
    cssVars: {
        light: Record<string, string>;
        dark: Record<string, string>;
    };
}

const baseColors: ThemeColor[] = [
    {
        name: 'zinc',
        label: 'Zinc',
        activeColor: {
            light: '0 0% 30%',
            dark: '0 0% 60%',
        },
        cssVars: {
            light: {
                primary: 'hsl(0 0% 30%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(0 0% 60%)',
                'primary-foreground': 'hsl(0 0% 12%)',
            },
        }
    },
    {
        name: 'red',
        label: 'Red',
        activeColor: {
            light: '0 72% 51%',
            dark: '0 65% 55%',
        },
        cssVars: {
            light: {
                primary: 'hsl(0 72% 51%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(0 65% 55%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
    {
        name: 'rose',
        label: 'Rose',
        activeColor: {
            light: '346 77% 50%',
            dark: '346 77% 55%',
        },
        cssVars: {
            light: {
                primary: 'hsl(346 77% 50%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(346 77% 55%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
    {
        name: 'orange',
        label: 'Orange',
        activeColor: {
            light: '24 75% 50%',
            dark: '24 75% 55%',
        },
        cssVars: {
            light: {
                primary: 'hsl(24 75% 50%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(24 75% 55%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
    {
        name: 'green',
        label: 'Green',
        activeColor: {
            light: '142 71% 45%',
            dark: '142 71% 50%',
        },
        cssVars: {
            light: {
                primary: 'hsl(142 71% 45%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(142 71% 50%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
    {
        name: 'blue',
        label: 'Blue',
        activeColor: {
            light: '221 83% 53%',
            dark: '221 83% 58%',
        },
        cssVars: {
            light: {
                primary: 'hsl(221 83% 53%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(221 83% 58%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
    {
        name: 'yellow',
        label: 'Yellow',
        activeColor: {
            light: '48 96% 53%',
            dark: '48 96% 58%',
        },
        cssVars: {
            light: {
                primary: 'hsl(48 96% 53%)',
                'primary-foreground': 'hsl(0 0% 12%)',
            },
            dark: {
                primary: 'hsl(48 96% 58%)',
                'primary-foreground': 'hsl(0 0% 12%)',
            },
        }
    },
    {
        name: 'violet',
        label: 'Violet',
        activeColor: {
            light: '258 90% 56%',
            dark: '258 90% 61%',
        },
        cssVars: {
            light: {
                primary: 'hsl(258 90% 56%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
            dark: {
                primary: 'hsl(258 90% 61%)',
                'primary-foreground': 'hsl(0 0% 98%)',
            },
        }
    },
];

export function ThemeCustomizer() {
    const [theme, setTheme] = useState<string>('zinc');
    const [radius, setRadius] = useState<number>(0.5);
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState<boolean>(false);

    // Function to apply theme to document root
    const applyTheme = (themeName: string, borderRadius: number, themeMode: 'light' | 'dark'): void => {
        const selectedTheme = baseColors.find((color) => color.name === themeName);
        if (!selectedTheme) return;

        // Apply color theme
        const root = document.documentElement;
        const cssVars = selectedTheme.cssVars[themeMode];

        // Set CSS variables
        root.style.setProperty('--primary', cssVars.primary);
        root.style.setProperty('--primary-foreground', cssVars['primary-foreground']);

        // Apply border radius
        root.style.setProperty('--radius', `${borderRadius}rem`);

        // Apply data attributes for debugging
        root.setAttribute('data-theme', themeName);
        root.setAttribute('data-radius', borderRadius.toString());
        root.setAttribute('data-mode', themeMode);

        // Toggle dark class on document for dark mode
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // Apply theme when component mounts and when theme changes
    useEffect(() => {
        setMounted(true);
        applyTheme(theme, radius, mode);
    }, [theme, radius, mode]);

    if (!mounted) {
        return null;
    }

    return (
        <Card className="rounded-lg border">
            <CardContent className="p-6">
                <div className="flex items-start pb-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold leading-none tracking-tight">Theme Customizer</h3>
                        <p className="text-sm text-muted-foreground">Customize your components colors.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto rounded-full"
                        onClick={() => {
                            setTheme('zinc');
                            setRadius(0.5);
                            applyTheme('zinc', 0.5, mode);
                        }}
                    >
                        <Repeat className="h-4 w-4" />
                        <span className="sr-only">Reset</span>
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Color</Label>
                        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
                            {baseColors.map((color) => {
                                const isActive = theme === color.name;
                                const colorHsl = color.cssVars[mode === 'dark' ? 'dark' : 'light'].primary;

                                return (
                                    <Button
                                        variant="outline"
                                        key={color.name}
                                        onClick={() => setTheme(color.name)}
                                        className={cn('h-11 w-11 p-0 flex items-center justify-center', isActive && 'border-2 border-primary')}
                                        title={color.label}
                                    >
                                        <span
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                            style={{ backgroundColor: colorHsl }}
                                        >
                                            {isActive && <Check className="h-4 w-4 text-white" />}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Radius</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {['0', '0.3', '0.5', '0.75', '1.0'].map((value) => {
                                const isActive = radius === parseFloat(value);

                                return (
                                    <Button
                                        variant="outline"
                                        key={value}
                                        onClick={() => setRadius(parseFloat(value))}
                                        className={cn(isActive && 'border-2 border-primary')}
                                        style={{ borderRadius: `calc(${value}rem * var(--radius-factor, 1))` }}
                                    >
                                        {value}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Mode</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setMode('light')}
                                className={cn(mode === 'light' && 'border-2 border-primary')}
                            >
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setMode('dark')}
                                className={cn(mode === 'dark' && 'border-2 border-primary')}
                            >
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

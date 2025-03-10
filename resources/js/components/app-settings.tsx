import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Globe, Lock, Palette, Settings, Shield, Sliders, User } from 'lucide-react';
import { useState } from 'react';
import { LayoutSelector } from './layout-selector';
import { ThemeCustomizer } from './theme-customizer';

export function AppSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [soundAlerts, setSoundAlerts] = useState(false);
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('UTC');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto px-3 sm:max-w-md">
                <SheetHeader className="pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <Sliders className="h-5 w-5" />
                        Settings
                    </SheetTitle>
                    <SheetDescription>Configure your application preferences and personalize your experience</SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="appearance" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="appearance">
                            <Palette className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications">
                            <Bell className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="preferences">
                            <User className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Preferences</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-4 py-4">
                        <LayoutSelector />
                        <ThemeCustomizer />
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notification Settings</CardTitle>
                                <CardDescription>Control when and how you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-notifications" className="text-sm">
                                            Email Notifications
                                        </Label>
                                        <p className="text-muted-foreground text-xs">Receive updates and alerts via email</p>
                                    </div>
                                    <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="push-notifications" className="text-sm">
                                            Push Notifications
                                        </Label>
                                        <p className="text-muted-foreground text-xs">Receive alerts on your device</p>
                                    </div>
                                    <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="sound-alerts" className="text-sm">
                                            Sound Alerts
                                        </Label>
                                        <p className="text-muted-foreground text-xs">Play sound when receiving notifications</p>
                                    </div>
                                    <Switch id="sound-alerts" checked={soundAlerts} onCheckedChange={setSoundAlerts} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-4 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Regional Settings</CardTitle>
                                <CardDescription>Customize language and time preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="language" className="flex items-center gap-1.5 text-sm">
                                        <Globe className="h-3.5 w-3.5" />
                                        Language
                                    </Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="zh">Chinese</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone" className="text-sm">
                                        Timezone
                                    </Label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                                            <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                                            <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                                            <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Privacy & Security</CardTitle>
                                <CardDescription>Manage your privacy and security settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="flex items-center gap-1.5 text-sm">
                                            <Lock className="h-3.5 w-3.5" />
                                            Two-Factor Authentication
                                        </Label>
                                        <p className="text-muted-foreground text-xs">Add an extra layer of security</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="flex items-center gap-1.5 text-sm">
                                            <Shield className="h-3.5 w-3.5" />
                                            Data Privacy
                                        </Label>
                                        <p className="text-muted-foreground text-xs">Manage data sharing preferences</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            // Reset all settings to defaults
                            document.documentElement.style.removeProperty('--primary');
                            document.documentElement.style.removeProperty('--primary-foreground');
                            document.documentElement.style.removeProperty('--radius');
                            document.documentElement.classList.remove('dark');
                            document.documentElement.removeAttribute('data-theme');
                            document.documentElement.removeAttribute('data-radius');
                            document.documentElement.removeAttribute('data-mode');
                            localStorage.removeItem('appLayout');
                        }}
                    >
                        Reset to Defaults
                    </Button>
                    <Button>Save Changes</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

import { Link } from '@inertiajs/react';
import { AlertTriangle, LockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import SelectionLayout from '@/layouts/access-layout';

export default function NoAccess() {
    return (
        <SelectionLayout title="No Business Access" description="Your account doesn't have access to any businesses in the system">
            <div className="mx-auto w-full max-w-md">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full p-3">
                            <AlertTriangle className="text-destructive h-6 w-6" />
                        </div>
                        <div className="mt-4 mb-2">
                            <div className="flex flex-col items-center gap-1">
                                <LockIcon className="text-muted-foreground h-5 w-5" />
                                <CardDescription className="mt-4">
                                    If you believe this is an error, please contact your system administrator or the person who invited you to the
                                    platform.
                                </CardDescription>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('logout')} method="post" as="button">
                                Logout
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="mailto:support@example.com">Contact Support</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </SelectionLayout>
    );
}

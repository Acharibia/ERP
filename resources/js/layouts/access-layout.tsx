import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// Import shadcn components
import { Footer } from '@/components/access/footer';
import { Header } from '@/components/access/header';
import { Card, CardContent } from '@/components/ui/card';

interface AccessLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
    businessName?: string;
}

export default function AccessLayout({ children, title, description, businessName }: AccessLayoutProps) {
    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Head title={title} />
            <Header />

            {/* Main content */}
            <main className="flex flex-1 flex-col items-center justify-start py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full">
                        {businessName ? (
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">{title}</h1>
                                <p className="text-muted-foreground">
                                    {description}: <span className="text-foreground font-medium">{businessName}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">{title}</h1>
                                <p className="text-muted-foreground">{description}</p>
                            </div>
                        )}

                        <Card className="border-none bg-transparent shadow-none">
                            <CardContent className="p-0">{children}</CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// Import shadcn components
import { Footer } from '@/components/access/footer';
import { Header } from '@/components/access/header';
import { Card, CardContent } from '@/components/ui/card';

interface AccessLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
}

export default function AccessLayout({ children, title, description }: AccessLayoutProps) {
    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Head title={title} />
            <Header />
            <main className="flex flex-1 flex-col items-center justify-start py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full">
                        <div>
                            <h1 className="text-xl font-bold">{title}</h1>
                            <p className="text-muted-foreground text-sm">{description}</p>
                        </div>

                        <Card className="border-none bg-transparent shadow-none">
                            <CardContent className="p-0">{children}</CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

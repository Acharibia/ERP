// resources/js/Layouts/landing-layout.jsx
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { BreadcrumbItem } from '@/types';
import { ReactNode } from 'react';
interface LandingLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default LandingLayout;

// resources/js/pages/index.tsx
import { HeroSection } from '@/components/landing/hero-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <LandingLayout>
            <Head title="Home | ERP System" />
            <HeroSection />
            {/* <VideoPlayer src="/assets/videos/billie.mp4"controls={true} /> */}
            {/* <FeaturesSection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection />
            <CTASection /> */}
        </LandingLayout>
    );
}

// resources/js/components/landing/footer.jsx
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FacebookIcon className="h-5 w-5" />, href: 'https://facebook.com' },
        { icon: <TwitterIcon className="h-5 w-5" />, href: 'https://twitter.com' },
        { icon: <InstagramIcon className="h-5 w-5" />, href: 'https://instagram.com' },
        { icon: <LinkedinIcon className="h-5 w-5" />, href: 'https://linkedin.com' },
    ];

    return (
        <footer className="bg-muted/40 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Bottom Footer */}
                <Separator />
                <div className="py-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex space-x-6">
                            {socialLinks.map((link, index) => (
                                <Button key={index} variant="ghost" size="icon" asChild>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary text-muted-foreground transition-colors"
                                    >
                                        {link.icon}
                                        <span className="sr-only">Social media</span>
                                    </a>
                                </Button>
                            ))}
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm md:mt-0">&copy; {currentYear} ERP System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

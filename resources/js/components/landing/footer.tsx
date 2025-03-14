// resources/js/components/landing/footer.jsx
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, Mail, MapPin, Phone, TwitterIcon } from 'lucide-react';
import AppLogo from '../app-logo';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '/features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Modules', href: '/modules' },
            { name: 'Updates', href: '/updates' },
        ],
        company: [
            { name: 'About', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Blog', href: '/blog' },
            { name: 'Contact', href: '/contact' },
        ],
        resources: [
            { name: 'Documentation', href: '/docs' },
            { name: 'Help Center', href: '/help' },
            { name: 'FAQ', href: '/faq' },
            { name: 'API', href: '/api-docs' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'GDPR', href: '/gdpr' },
        ],
    };

    const socialLinks = [
        { icon: <FacebookIcon className="h-5 w-5" />, href: 'https://facebook.com' },
        { icon: <TwitterIcon className="h-5 w-5" />, href: 'https://twitter.com' },
        { icon: <InstagramIcon className="h-5 w-5" />, href: 'https://instagram.com' },
        { icon: <LinkedinIcon className="h-5 w-5" />, href: 'https://linkedin.com' },
    ];

    return (
        <footer className="bg-muted/40 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center">
                            <AppLogo />
                        </Link>
                        <CardDescription className="mt-4 max-w-xs">
                            Enterprise Resource Planning solution for businesses of all sizes. Streamline your operations with our modular platform.
                        </CardDescription>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-2">
                            <div className="text-muted-foreground flex items-center text-sm">
                                <Mail className="mr-2 h-4 w-4" />
                                <span>contact@erpsystem.com</span>
                            </div>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <Phone className="mr-2 h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="text-muted-foreground flex items-start text-sm">
                                <MapPin className="mt-1 mr-2 h-4 w-4" />
                                <span>
                                    123 Business Avenue, Suite 100
                                    <br />
                                    Enterprise City, EC 10001
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="lg:col-span-1">
                            <h3 className="text-sm font-semibold tracking-wider uppercase">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                            <ul className="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-primary text-muted-foreground text-sm transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Footer */}
                <Separator />
                <div className="py-6">
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

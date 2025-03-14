// resources/js/pages/landing/contact.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import LandingLayout from '@/layouts/landing-layout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

interface ContactInfo {
    icon: React.ReactNode;
    title: string;
    description: string;
    details: string;
}

const breadcrumbs = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Contact',
        href: '/contact',
    },
];

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiry_type: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => reset(),
        });
    };

    const contactInfo: ContactInfo[] = [
        {
            icon: <Phone className="h-5 w-5" />,
            title: 'Talk to Sales',
            description: 'Interested in our ERP solution?',
            details: '+1 (555) 123-4567',
        },
        {
            icon: <Mail className="h-5 w-5" />,
            title: 'Contact Support',
            description: 'Need technical help?',
            details: 'support@erpsystem.com',
        },
        {
            icon: <MapPin className="h-5 w-5" />,
            title: 'Visit Our Office',
            description: 'Come say hello at our office',
            details: '123 Business Ave, Enterprise City',
        },
        {
            icon: <Clock className="h-5 w-5" />,
            title: 'Business Hours',
            description: 'When were available',
            details: 'Mon-Fri: 9AM-5PM EST',
        },
    ];

    return (
        <LandingLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Us | ERP System" />

            {/* Header */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-3xl font-bold">Contact Us</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">Have questions about our ERP platform? We're here to help.</p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {contactInfo.map((item, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary rounded-md p-2">{item.icon}</div>
                                        <div>
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-xs text-gray-500">{item.description}</p>
                                            <p className="mt-1 text-sm">{item.details}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form and Map */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-xl font-bold">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="inquiry_type">Inquiry Type</Label>
                                        <Select value={data.inquiry_type} onValueChange={(value) => setData('inquiry_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sales">Sales</SelectItem>
                                                <SelectItem value="support">Support</SelectItem>
                                                <SelectItem value="billing">Billing</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} required />
                                </div>

                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        rows={4}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>

                        {/* Map */}
                        <div>
                            <h2 className="text-xl font-bold">Our Location</h2>
                            <p className="mt-2 text-gray-600">Visit our headquarters or contact us remotely.</p>
                            <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
                                <iframe
                                    title="Map"
                                    className="h-full w-full"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770525!2d-118.69192047471653!3d34.02016130653036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sca!4v1585710407515!5m2!1sen!2sca"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    aria-hidden="false"
                                    tabIndex={0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}

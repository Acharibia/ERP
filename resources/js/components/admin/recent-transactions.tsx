'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const RecentTransactions = () => {
    // Sample sales data
    const salesData = [
        {
            name: 'Olivia Martin',
            email: 'olivia.martin@example.com',
            amount: '+$1,999.00',
            status: 'Success',
            date: 'Today, 2:30 PM',
            image: '',
            initials: 'OM',
        },
        {
            name: 'Jackson Lee',
            email: 'jackson.lee@example.com',
            amount: '+$39.00',
            status: 'Success',
            date: 'Today, 1:15 PM',
            image: '',
            initials: 'JL',
        },
        {
            name: 'Isabella Nguyen',
            email: 'isabella.nguyen@example.com',
            amount: '+$299.00',
            status: 'Success',
            date: 'Yesterday, 3:45 PM',
            image: '',
            initials: 'IN',
        },
        {
            name: 'William Kim',
            email: 'will@example.com',
            amount: '+$99.00',
            status: 'Success',
            date: 'Yesterday, 11:30 AM',
            image: '',
            initials: 'WK',
        },
        {
            name: 'Sofia Davis',
            email: 'sofia.davis@example.com',
            amount: '+$450.00',
            status: 'Success',
            date: 'Mar 13, 9:00 AM',
            image: '',
            initials: 'SD',
        },
    ];

    return (
        <Card className='col-span-5'>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>You made 265 sales this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {salesData.map((sale, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={sale.image} alt={sale.name} />
                                    <AvatarFallback>{sale.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{sale.name}</div>
                                    <div className="text-muted-foreground text-xs">{sale.date}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                    {sale.status}
                                </Badge>
                                <div className="font-medium tabular-nums">{sale.amount}</div>
                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingBasket } from 'lucide-react';

export function OrdersDropdown() {
    const orders = [
        {
            id: 1,
            orderNumber: 'ORD-2024-0001',
            status: 'Processing',
            items: [
                { name: 'HR Module License', price: 299.99, quantity: 1 },
                { name: 'Additional User Seat', price: 49.99, quantity: 3 },
            ],
            totalAmount: 499.96,
            date: '2024-04-15',
        },
        {
            id: 2,
            orderNumber: 'ORD-2024-0002',
            status: 'Completed',
            items: [{ name: 'CRM Module Upgrade', price: 199.99, quantity: 1 }],
            totalAmount: 199.99,
            date: '2024-04-10',
        },
    ];

    const totalOrders = orders.length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBasket className="h-5 w-5" />
                    {totalOrders > 0 && (
                        <Badge variant="destructive" className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-xs">
                            {totalOrders}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Recent Orders</span>
                    <span className="text-muted-foreground text-sm">
                        {totalOrders} order{totalOrders !== 1 ? 's' : ''}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <DropdownMenuItem key={order.id} className="flex flex-col">
                            <div className="flex w-full items-center justify-between">
                                <div>
                                    <div className="font-medium">{order.orderNumber}</div>
                                    <div className="text-muted-foreground text-xs">{order.date}</div>
                                </div>
                                <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} className="text-xs">
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="mt-2 w-full">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between border-b py-1 text-sm last:border-b-0">
                                        <span>{item.name}</span>
                                        <span>
                                            {item.quantity} × ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 flex w-full justify-between font-semibold">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No recent orders</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button variant="ghost" className="w-full">
                        View All Orders
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

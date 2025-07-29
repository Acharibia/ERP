import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeEmergencyContactInfo } from '@/types/hr/employee';
import InfoBlock from '../ui/info-block';

type Props = {
    emergency_contacts: EmployeeEmergencyContactInfo[];
};

export default function EmergencyContactInfoCard({ emergency_contacts }: Props) {
    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Who to call in case of an emergency</CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
                {emergency_contacts?.length ? (
                    emergency_contacts.map((contact, idx) => (
                        <div key={idx} className="border-secondary relative grid grid-cols-[auto,1fr] gap-4 border-l pl-4">
                            <div className="flex flex-col items-start">
                                <Badge className="h-10 min-w-10 rounded-lg" variant="outline">
                                    {idx + 1}
                                </Badge>
                                {idx < emergency_contacts.length - 1 && <div className="bg-secondary h-full w-px" />}
                            </div>

                            <div className="grid w-full grid-cols-1 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                <InfoBlock label="Name" value={contact.name} />
                                <InfoBlock label="Relationship" value={contact.relationship} />
                                <InfoBlock label="Primary Phone" value={contact.primary_phone} />
                                <InfoBlock label="Secondary Phone" value={contact.secondary_phone} />
                                <InfoBlock label="Email" value={contact.email} />
                                <InfoBlock label="Address" value={contact.address} />
                                <InfoBlock label="City" value={contact.city} />
                                <InfoBlock label="State" value={contact.state?.name} />
                                <InfoBlock label="Postal Code" value={contact.postal_code} />
                                <InfoBlock label="Country" value={contact.country?.name} />
                                <InfoBlock label="Primary Contact" value={contact.is_primary ? 'Yes' : 'No'} />
                                <InfoBlock label="Notes" value={contact.notes} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm">No emergency contacts added</p>
                )}
            </CardContent>
        </Card>
    );
}

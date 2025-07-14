import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InfoBlock from '@/components/ui/info-block';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { EmployeePersonalInfo } from '@/types/employee';

type Props = {
    personal: EmployeePersonalInfo;
};

export default function PersonalInfoCard({ personal }: Props) {
    const { formatDate } = useDateFormatter();

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
                <CardDescription className="text-sm">Identity, contact details & location</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-4 md:gap-x-6">
                    <div className="flex flex-col items-center gap-4 md:items-start">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={personal?.profile_picture ?? ''} alt={personal?.name} />
                            <AvatarFallback className="text-xl font-semibold">{personal?.name?.[0] ?? '👤'}</AvatarFallback>
                        </Avatar>
                        <InfoBlock label="Bio" value={personal?.bio} className="text-sm whitespace-pre-wrap md:max-w-[14rem]" />
                    </div>
                    <div className="border-secondary border-l pl-6 md:col-span-3">
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                            <InfoBlock label="Full Name" value={personal?.name} />
                            <InfoBlock label="Birth Date" value={formatDate(personal?.birth_date)} />

                            <InfoBlock label="Gender" value={personal?.gender?.name} />
                            <InfoBlock label="Marital Status" value={personal?.marital_status} />
                            <InfoBlock label="Nationality" value={personal?.nationality} />
                            <InfoBlock label="National ID" value={personal?.national_id} />
                            <InfoBlock label="Personal Email" value={personal?.personal_email} />
                            <InfoBlock label="Work Email" value={personal?.work_email} />
                            <InfoBlock label="Personal Phone" value={personal?.personal_phone} />
                            <InfoBlock label="Work Phone" value={personal?.work_phone} />
                            <InfoBlock label="City" value={personal?.city} />
                            <InfoBlock label="State" value={personal?.state?.name} />
                            <InfoBlock label="Postal Code" value={personal?.postal_code} />
                            <InfoBlock label="Country" value={personal?.country?.name} />
                            <InfoBlock
                                label="Address"
                                value={personal?.address ? `${personal.address}${personal.city ? `, ${personal.city}` : ''}` : undefined}
                                className="sm:col-span-2 lg:col-span-3"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InfoBlock from '@/components/ui/info-block';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { EmployeeEmploymentInfo } from '@/types/hr/employee';

type Props = {
    employment: EmployeeEmploymentInfo;
};

export default function EmploymentInfoCard({ employment }: Props) {
    const { formatDate } = useDateFormatter();
    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>Role, reporting and contract details</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-4 md:gap-x-6">
                    <div className="flex flex-col gap-4">
                        <InfoBlock label="Department" value={employment?.department?.name} />
                        <InfoBlock label="Position" value={employment?.position?.title} />
                        <InfoBlock label="Manager" value={employment?.manager?.name} />
                        <div>
                            <p className="text-muted-foreground mb-1">Employment Status</p>
                            <Badge variant="outline" className="w-fit">
                                {employment?.employment_status || '—'}
                            </Badge>
                        </div>
                        <InfoBlock label="Employment Type" value={employment?.employment_type} className="capitalize" />
                        <InfoBlock label="Work Location" value={employment?.work_location} />
                    </div>

                    <div className="border-secondary border-l pl-6 md:col-span-3">
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                            <InfoBlock label="Hire Date" value={formatDate(employment?.hire_date)} />
                            <InfoBlock label="Probation Start" value={formatDate(employment?.probation_start_date)} />
                            <InfoBlock label="Probation End" value={formatDate(employment?.probation_end_date)} />
                            <InfoBlock label="Contract Start" value={formatDate(employment?.contract_start_date)} />
                            <InfoBlock label="Contract End" value={formatDate(employment?.contract_end_date)} />
                            <InfoBlock label="Termination Date" value={formatDate(employment?.termination_date)} />
                            <InfoBlock
                                label="Termination Reason"
                                value={employment?.termination_reason}
                                className="whitespace-pre-wrap sm:col-span-2 lg:col-span-3"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

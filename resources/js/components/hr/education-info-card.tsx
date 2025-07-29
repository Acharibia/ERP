import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { EmployeeEducationInfo } from '@/types/hr/employee';
import InfoBlock from '../ui/info-block';

type Props = {
    education: EmployeeEducationInfo[];
};

export default function EducationInfoCard({ education }: Props) {
    const { formatDate } = useDateFormatter();

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Academic background</CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
                {education?.length ? (
                    education.map((edu, idx) => (
                        <div key={idx} className="border-secondary relative grid grid-cols-[auto,1fr] gap-4 border-l pl-4">
                            <div className="flex flex-col items-start">
                                <Badge className="h-10 min-w-10 rounded-lg" variant="outline">
                                    {idx + 1}
                                </Badge>
                                {idx < education.length - 1 && <div className="bg-secondary h-full w-px" />}
                            </div>
                            <div className="grid w-full grid-cols-1 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                <InfoBlock label="Institution" value={edu.institution} />
                                <InfoBlock label="Country" value={edu.country?.name} />
                                <InfoBlock label="Degree Type" value={edu.degree_type} />
                                <InfoBlock label="Field of Study" value={edu.field_of_study} />
                                <InfoBlock label="Start Date" value={formatDate(edu.start_date)} />
                                <InfoBlock label="End Date" value={formatDate(edu.end_date)} />
                                <InfoBlock label="Graduation Date" value={formatDate(edu.graduation_date)} />
                                <InfoBlock label="Status" value={edu.is_current ? 'Currently Studying' : edu.is_completed ? 'Completed' : '—'} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm">No education records</p>
                )}
            </CardContent>
        </Card>
    );
}

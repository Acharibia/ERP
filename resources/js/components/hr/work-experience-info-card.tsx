import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { EmployeeWorkExperienceInfo } from '@/types/hr/employee';
import InfoBlock from '../ui/info-block';

type Props = {
    work_experience: EmployeeWorkExperienceInfo[];
};

export default function WorkExperienceInfoCard({ work_experience }: Props) {
    const { formatDate } = useDateFormatter();

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Previous roles and responsibilities</CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
                {work_experience?.length ? (
                    work_experience.map((exp, idx) => (
                        <div key={idx} className="border-secondary relative grid grid-cols-[auto,1fr] gap-4 border-l pl-4">
                            <div className="flex flex-col items-start">
                                <Badge className="h-10 min-w-10 rounded-lg" variant="outline">
                                    {idx + 1}
                                </Badge>
                                {idx < work_experience.length - 1 && <div className="bg-secondary h-full w-px" />}
                            </div>
                            <div className="grid w-full grid-cols-1 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                <InfoBlock label="Company Name" value={exp.company_name} />
                                <InfoBlock label="Job Title" value={exp.job_title} />
                                <InfoBlock label="Start Date" value={formatDate(exp.start_date)} />
                                <InfoBlock label="End Date" value={formatDate(exp.end_date) || (exp.is_current ? 'Present' : '—')} />
                                <InfoBlock label="Company Location" value={exp.company_location} />
                                <InfoBlock label="Responsibilities" value={exp.responsibilities} />
                                <InfoBlock label="Achievements" value={exp.achievements} />
                                <InfoBlock label="Reference Name" value={exp.reference_name} />
                                <InfoBlock label="Reference Contact" value={exp.reference_contact} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm">No work experience records</p>
                )}
            </CardContent>
        </Card>
    );
}

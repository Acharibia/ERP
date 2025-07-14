import { Badge } from '@/components/ui/badge';
import { BadgeColumnProps } from '@/types/data-table';
import { LucideIconByName } from './lucide-icon-by-name';

export const BadgeColumn: React.FC<BadgeColumnProps> = ({ value, config }) => {
    const badge = config[value] || config['default'] || { color: 'default' };
    return (
        <Badge
            variant={badge.color as 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined}
            className="flex items-center gap-1 capitalize"
        >
            {badge.icon && <LucideIconByName name={badge.icon} className="mr-1 h-4 w-4" />}
            {value}
        </Badge>
    );
};

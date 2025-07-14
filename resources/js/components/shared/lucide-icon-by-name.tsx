import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type LucideIconName = keyof typeof LucideIcons;

interface LucideIconByNameProps extends LucideProps {
    name: LucideIconName;
}

export function LucideIconByName({ name, ...props }: LucideIconByNameProps) {
    const Icon = LucideIcons[name] as React.FC<LucideProps>;
    if (!Icon) return null;
    return <Icon {...props} />;
}

import { Checkbox } from '@/components/ui/checkbox';

type SelectColumnProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export const SelectColumn: React.FC<SelectColumnProps> = ({ checked, onChange }) => (
    <div onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onCheckedChange={onChange} />
    </div>
);

// components/ui/info-block.tsx
interface InfoBlockProps {
    label: string;
    value?: React.ReactNode;
    className?: string;
}

export default function InfoBlock({ label, value = '—', className }: InfoBlockProps) {
    return (
        <div className={className}>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium whitespace-pre-wrap">{value || '—'}</p>
        </div>
    );
}

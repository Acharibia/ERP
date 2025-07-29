import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploader from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import React from 'react';

export type Material = {
    title: string;
    url: string;
    file: File | null;
};

type Props = {
    materials: Material[];
    onChange: (materials: Material[]) => void;
    disabled?: boolean;
};

export const CourseMaterialsSection: React.FC<Props> = ({ materials, onChange, disabled }) => {
    const handleMaterialChange = (idx: number, field: keyof Material, value: string | File | null) => {
        onChange(materials.map((mat, i) => (i === idx ? { ...mat, [field]: value } : mat)));
    };
    const handleAddMaterial = () => {
        onChange([...materials, { title: '', url: '', file: null }]);
    };
    const handleRemoveMaterial = (idx: number) => {
        onChange(materials.filter((_, i) => i !== idx));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {materials.map((mat, idx) => (
                    <div key={idx} className="flex flex-col gap-4 border-b pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-end">
                        <div className="flex w-full min-w-0 flex-1 flex-col gap-2 md:gap-4">
                            <div>
                                <Label htmlFor={`material-title-${idx}`}>Title</Label>
                                <Input
                                    id={`material-title-${idx}`}
                                    value={mat.title}
                                    onChange={(e) => handleMaterialChange(idx, 'title', e.target.value)}
                                    placeholder="Material title"
                                    required
                                    disabled={disabled}
                                    className="mt-1 w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`material-url-${idx}`}>URL</Label>
                                <Input
                                    id={`material-url-${idx}`}
                                    value={mat.url}
                                    onChange={(e) => handleMaterialChange(idx, 'url', e.target.value)}
                                    placeholder="https://..."
                                    type="url"
                                    disabled={disabled}
                                    className="mt-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-end gap-2 md:flex-col md:items-center md:gap-4">
                            <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
                                <FileUploader
                                    value={undefined}
                                    onChange={(file) => handleMaterialChange(idx, 'file', file)}
                                    accept={{
                                        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                                        'application/pdf': ['.pdf'],
                                        'video/*': ['.mp4', '.mov'],
                                    }}
                                    maxFiles={1}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveMaterial(idx)}
                                disabled={materials.length === 1 || disabled}
                                className="mt-2 md:mt-4"
                                aria-label="Remove material"
                            >
                                <X />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button type="button" variant="outline" onClick={handleAddMaterial} disabled={disabled}>
                    Add Material
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CourseMaterialsSection;

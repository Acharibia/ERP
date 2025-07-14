import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

type Method = 'post' | 'put' | 'patch' | 'delete';
type FieldType = 'input' | 'textarea' | 'switch' | 'combobox' | 'hidden';

type BaseField = {
    name: string;
    label?: string;
    type: FieldType;
    placeholder?: string;
    autoComplete?: string;
    value?: string | number | boolean | (string | number)[];
};

type ComboboxField = BaseField & {
    type: 'combobox';
    options: { label: string; value: string | number }[];
};

type Field = BaseField | ComboboxField;

export type ConfirmActionDialogRef = {
    openDialog: () => void;
    closeDialog: () => void;
};

type ConfirmActionDialogProps = {
    triggerText?: string;
    title: string;
    description: string;
    url: string;
    method?: Method;
    fields?: Field[];
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    preserveScroll?: boolean;
    useRouter?: boolean;
    onSuccess?: () => void;
    extraData?: Record<string, string | boolean | number | null>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onError?: (errors: Record<string, string[]>) => void;
};

const ConfirmActionDialog = forwardRef<ConfirmActionDialogRef, ConfirmActionDialogProps>((props, ref) => {
    const {
        triggerText,
        title,
        description,
        url,
        method = 'delete',
        fields = [],
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        destructive = true,
        preserveScroll = true,
        useRouter = true,
        onSuccess,
        onError, // ✅ Fix: properly destructure onError
        extraData = {},
        open: externalOpen,
        onOpenChange: externalOnOpenChange,
    } = props;

    const [internalOpen, setInternalOpen] = useState(false);
    const controlled = externalOpen !== undefined;

    const open = controlled ? externalOpen : internalOpen;
    const setOpen = controlled ? externalOnOpenChange! : setInternalOpen;

    const initialData = Object.fromEntries(fields.map((f) => [f.name, f.value ?? (f.type === 'switch' ? false : '')]));

    const {
        data,
        setData,
        post,
        put,
        patch,
        delete: destroy,
        reset,
        processing,
        errors,
        clearErrors,
        setError,
    } = useForm<Record<string, any>>(initialData);

    const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useImperativeHandle(ref, () => ({
        openDialog: () => setOpen(true),
        closeDialog: () => {
            setOpen(false);
            reset();
            clearErrors();
        },
    }));

    const closeModal = () => {
        reset();
        clearErrors();
        setOpen(false);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const payload = { ...data, ...extraData };

        const visitOptions = {
            data: payload,
            preserveScroll,
            preserveState: true,
            onSuccess: () => {
                closeModal();
                onSuccess?.();
            },
            onError: (formErrors: Record<string, string | string[]>) => {
                for (const key in formErrors) {
                    const value = formErrors[key];
                    setError(key, Array.isArray(value) ? value[0] : value);
                }

                const firstError = Object.values(formErrors)[0];
                const message = Array.isArray(firstError) ? firstError[0] : firstError;
                if (message) toast.error(message);

                const fieldWithError = fields.find((f) => formErrors[f.name]);
                if (fieldWithError?.name && fieldRefs.current[fieldWithError.name]) {
                    fieldRefs.current[fieldWithError.name]?.focus?.();
                }

                // Optionally call external handler
                onError?.(Object.fromEntries(Object.entries(formErrors).map(([key, val]) => [key, Array.isArray(val) ? val : [val]])));
            },
        };

        if (useRouter) {
            router.visit(url, { method, ...visitOptions });
        } else {
            switch (method) {
                case 'post':
                    post(url, visitOptions);
                    break;
                case 'put':
                    put(url, visitOptions);
                    break;
                case 'patch':
                    patch(url, visitOptions);
                    break;
                case 'delete':
                    destroy(url, visitOptions);
                    break;
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerText && (
                <DialogTrigger asChild>
                    <Button variant={destructive ? 'destructive' : 'default'}>{triggerText}</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="grid gap-2">
                            {field.label && field.type !== 'switch' && <Label htmlFor={field.name}>{field.label}</Label>}

                            {field.type === 'input' && (
                                <Input
                                    id={field.name}
                                    value={String(data[field.name])}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autoComplete}
                                    ref={(el) => {
                                        fieldRefs.current[field.name] = el;
                                    }}
                                />
                            )}

                            {field.type === 'hidden' && (
                                <Input
                                    id={field.name}
                                    type="hidden"
                                    value={String(data[field.name])}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    ref={(el) => {
                                        fieldRefs.current[field.name] = el;
                                    }}
                                />
                            )}

                            {field.type === 'textarea' && (
                                <Textarea
                                    id={field.name}
                                    value={String(data[field.name])}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            )}

                            {field.type === 'switch' && (
                                <div className="flex items-center space-x-2">
                                    <Switch id={field.name} checked={Boolean(data[field.name])} onCheckedChange={(val) => setData(field.name, val)} />
                                    <Label htmlFor={field.name}>{field.label}</Label>
                                </div>
                            )}

                            {field.type === 'combobox' && 'options' in field && (
                                <Combobox
                                    options={field.options}
                                    value={data[field.name] as string | number}
                                    onChange={(val) => setData(field.name, String(val))}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder={field.placeholder}
                                />
                            )}

                            <InputError message={errors[field.name]} />
                        </div>
                    ))}

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={closeModal}>
                                {cancelText}
                            </Button>
                        </DialogClose>
                        <Button variant={destructive ? 'destructive' : 'default'} disabled={processing} asChild>
                            <button type="submit">{confirmText}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

ConfirmActionDialog.displayName = 'ConfirmActionDialog';
export default ConfirmActionDialog;

import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Country, State } from '@/types';
import { EmployeeEmergencyContactForm, EmployeeEmergencyContactInfo } from '@/types/employee';
import { router } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight, PhoneCall, PlusCircle, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    onNext: () => void;
    onBack: () => void;
    countries: Country[];
    states: State[];
    data: (EmployeeEmergencyContactForm | EmployeeEmergencyContactInfo)[];
    setData: (data: EmployeeEmergencyContactForm[]) => void;
}

export function EmergencyContactStep({ onNext, onBack, countries, states, data, setData }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = <K extends keyof EmployeeEmergencyContactForm>(index: number, field: K, value: EmployeeEmergencyContactForm[K]) => {
        const updated = [...data] as EmployeeEmergencyContactForm[];
        updated[index] = { ...updated[index], [field]: value };
        setData(updated);
    };

    const addContact = () => {
        setData([
            ...data,
            {
                name: '',
                relationship: '',
                primary_phone: '',
                secondary_phone: '',
                email: '',
                address: '',
                city: '',
                state_id: '',
                country_id: '',
                postal_code: '',
                is_primary: false,
                notes: '',
            },
        ] as EmployeeEmergencyContactForm[]);
    };

    const removeContact = (index: number) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated as EmployeeEmergencyContactForm[]);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route('modules.hr.employees.store.emergency-contact-info'),
            { emergency_contacts: data as EmployeeEmergencyContactForm[] },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onNext();
                },
                onError: (errs) => {
                    setProcessing(false);
                    setErrors(errs);
                },
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold uppercase">Emergency Contacts</h4>
                <Button type="button" variant="outline" size="sm" onClick={addContact}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            {data.length === 0 && (
                <EmptyState
                    icon={PhoneCall}
                    iconSize="h-12 w-12"
                    title="No Emergency Contact"
                    description="Add at least one emergency contact to reach in case of an emergency."
                    primaryAction={{
                        label: 'Add Contact',
                        onClick: addContact,
                    }}
                />
            )}

            {data.map((contact, index) => (
                <div key={index} className="relative space-y-4 rounded-lg border p-6">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => removeContact(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Name</Label>
                            <Input value={contact.name} onChange={(e) => handleChange(index, 'name', e.target.value)} placeholder="e.g. Jane Doe" />
                            <InputError message={errors[`emergency_contacts.${index}.name`]} />
                        </div>
                        <div>
                            <Label>Relationship</Label>
                            <Input
                                value={contact.relationship}
                                onChange={(e) => handleChange(index, 'relationship', e.target.value)}
                                placeholder="e.g. Sister"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.relationship`]} />
                        </div>
                        <div>
                            <Label>Primary Phone</Label>
                            <PhoneInput
                                international
                                defaultCountry="GH"
                                value={contact.primary_phone}
                                onChange={(val) => handleChange(index, 'primary_phone', val)}
                                placeholder="e.g. +233 20 000 0000"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.primary_phone`]} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Secondary Phone</Label>
                            <PhoneInput
                                international
                                defaultCountry="GH"
                                value={contact.secondary_phone}
                                onChange={(val) => handleChange(index, 'secondary_phone', val)}
                                placeholder="Optional"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.secondary_phone`]} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                value={contact.email}
                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                                placeholder="jane@example.com"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.email`]} />
                        </div>
                        <div>
                            <Label>Country</Label>
                            <Combobox
                                value={contact.country_id ?? ''}
                                onChange={(val) => handleChange(index, 'country_id', val ?? '')}
                                options={countries.map((c) => ({ label: c.name, value: c.id }))}
                                placeholder="Select country"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.country_id`]} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>State/Region</Label>
                            <Combobox
                                value={contact.state_id ?? ''}
                                onChange={(val) => handleChange(index, 'state_id', val ?? '')}
                                options={states.map((s) => ({ label: s.name, value: s.id }))}
                                placeholder="Select state"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.state_id`]} />
                        </div>
                        <div>
                            <Label>City</Label>
                            <Input value={contact.city} onChange={(e) => handleChange(index, 'city', e.target.value)} placeholder="e.g. Accra" />
                            <InputError message={errors[`emergency_contacts.${index}.city`]} />
                        </div>
                        <div>
                            <Label>Postal Code</Label>
                            <Input
                                value={contact.postal_code}
                                onChange={(e) => handleChange(index, 'postal_code', e.target.value)}
                                placeholder="e.g. 00233"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.postal_code`]} />
                        </div>
                    </div>

                    <div className="grid items-center gap-4 md:grid-cols-3">
                        <div>
                            <Label>Address</Label>
                            <Textarea
                                value={contact.address}
                                onChange={(e) => handleChange(index, 'address', e.target.value)}
                                placeholder="e.g. 123 Main St"
                            />
                            <InputError message={errors[`emergency_contacts.${index}.address`]} />
                        </div>

                        <div>
                            <Label>Notes</Label>
                            <Textarea
                                value={contact.notes}
                                onChange={(e) => handleChange(index, 'notes', e.target.value)}
                                placeholder="Any additional information..."
                            />
                            <InputError message={errors[`emergency_contacts.${index}.notes`]} />
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                            <Switch
                                id={`is_primary-${index}`}
                                checked={contact.is_primary}
                                onCheckedChange={(val) => handleChange(index, 'is_primary', val)}
                            />
                            <Label htmlFor={`is_primary-${index}`}>Primary Contact</Label>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between pt-4">
                <Button type="button" onClick={onBack} variant="outline">
                    <ChevronsLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button type="submit" disabled={processing}>
                    Save & Continue
                    <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}

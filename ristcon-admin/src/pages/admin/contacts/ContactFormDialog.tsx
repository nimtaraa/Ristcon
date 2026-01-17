import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateContact, useUpdateContact } from '@/hooks/useContacts';
import type { ContactPerson } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  mobile: z.string().min(1, 'Mobile is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  address: z.string().optional(),
  display_order: z.number().min(0),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: ContactPerson | null;
  editionId: number;
}

export default function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  editionId,
}: ContactFormDialogProps) {
  const createContact = useCreateContact(editionId);
  const updateContact = useUpdateContact(editionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      full_name: '',
      role: '',
      department: '',
      mobile: '',
      phone: '',
      email: '',
      address: '',
      display_order: 0,
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        full_name: contact.full_name,
        role: contact.role,
        department: contact.department || '',
        mobile: contact.mobile,
        phone: contact.phone || '',
        email: contact.email,
        address: contact.address || '',
        display_order: contact.display_order,
      });
    } else {
      reset({
        full_name: '',
        role: '',
        department: '',
        mobile: '',
        phone: '',
        email: '',
        address: '',
        display_order: 0,
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactFormValues) => {
    if (contact) {
      await updateContact.mutateAsync({ id: contact.id, data });
    } else {
      await createContact.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact Person' : 'Add Contact Person'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Update the contact person details below.' : 'Fill in the details for the new contact person.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" {...register('full_name')} className="mt-2" />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Input id="role" {...register('role')} placeholder="e.g., Conference Chair" className="mt-2" />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...register('department')} className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobile">Mobile *</Label>
              <Input id="mobile" {...register('mobile')} placeholder="+1234567890" className="mt-2" />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone (Alternative)</Label>
              <Input id="phone" {...register('phone')} className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} className="mt-2" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register('address')} rows={3} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="display_order">Display Order *</Label>
            <Input 
              id="display_order" 
              type="number" 
              {...register('display_order', { valueAsNumber: true })} 
              className="mt-2" 
            />
            <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            {errors.display_order && (
              <p className="text-red-500 text-sm mt-1">{errors.display_order.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createContact.isPending || updateContact.isPending}
            >
              {createContact.isPending || updateContact.isPending
                ? contact
                  ? 'Updating...'
                  : 'Creating...'
                : contact
                ? 'Update Contact'
                : 'Create Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

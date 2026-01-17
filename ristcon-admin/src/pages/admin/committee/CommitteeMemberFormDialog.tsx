import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCreateCommitteeMember,
  useUpdateCommitteeMember,
  useCommitteeTypes,
} from '@/hooks/useCommitteeMembers';
import type { CommitteeMember } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const memberSchema = z.object({
  committee_type_id: z.number().min(1, 'Committee type is required'),
  full_name: z.string().min(1, 'Full name is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().optional(),
  affiliation: z.string().min(1, 'Affiliation is required'),
  role: z.string().min(1, 'Role is required'),
  display_order: z.number().min(0).optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface CommitteeMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: CommitteeMember | null;
  editionId: number;
}

export default function CommitteeMemberFormDialog({
  open,
  onOpenChange,
  member,
  editionId,
}: CommitteeMemberFormDialogProps) {
  const createMember = useCreateCommitteeMember(editionId);
  const updateMember = useUpdateCommitteeMember(editionId);
  const { data: committeeTypes } = useCommitteeTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      committee_type_id: committeeTypes?.[0]?.id || 1,
      display_order: 0,
    },
  });

  const committeeTypeId = watch('committee_type_id');

  useEffect(() => {
    if (member) {
      reset({
        committee_type_id: member.committee_type_id,
        full_name: member.full_name,
        designation: member.designation,
        department: member.department || '',
        affiliation: member.affiliation,
        role: member.role,
        display_order: member.display_order || 0,
      });
    } else {
      reset({
        committee_type_id: committeeTypes?.[0]?.id || 1,
        full_name: '',
        designation: '',
        department: '',
        affiliation: '',
        role: '',
        display_order: 0,
      });
    }
  }, [member, reset, committeeTypes]);

  const onSubmit = async (data: MemberFormData) => {
    try {
      if (member) {
        // Update existing member
        await updateMember.mutateAsync({
          id: member.id,
          data,
        });
      } else {
        // Create new member
        await createMember.mutateAsync(data);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save committee member:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Committee Member' : 'Add Committee Member'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Update committee member information.'
              : 'Add a new committee member to the selected edition'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder="Dr. John Doe"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="committee_type_id">Committee Type *</Label>
              <Select
                value={committeeTypeId?.toString() || ''}
                onValueChange={(value) =>
                  setValue('committee_type_id', Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {committeeTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.committee_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.committee_type_id && (
                <p className="text-sm text-red-600">{errors.committee_type_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                {...register('designation')}
                placeholder="Professor"
              />
              {errors.designation && (
                <p className="text-sm text-red-600">{errors.designation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation">Affiliation *</Label>
            <Input
              id="affiliation"
              {...register('affiliation')}
              placeholder="University Name"
            />
            {errors.affiliation && (
              <p className="text-sm text-red-600">{errors.affiliation.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                {...register('role')}
                placeholder="Chair, Co-Chair, Member"
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
              {createMember.isPending || updateMember.isPending
                ? 'Saving...'
                : member
                ? 'Update Member'
                : 'Create Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

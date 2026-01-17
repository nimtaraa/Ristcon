import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import {
  useCommitteeMembers,
  useCommitteeTypes,
  useDeleteCommitteeMember,
} from '@/hooks/useCommitteeMembers';
import type { CommitteeMember } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, User, Pencil, Trash2, Globe } from 'lucide-react';
import CommitteeMemberFormDialog from './CommitteeMemberFormDialog';

export default function CommitteeMembersPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const { data: committeeTypes } = useCommitteeTypes();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const [selectedCommitteeType, setSelectedCommitteeType] = useState<number | null>(null);
  const { data: members, isLoading: loadingMembers } = useCommitteeMembers(selectedEditionId);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<CommitteeMember | null>(null);

  const deleteMember = useDeleteCommitteeMember(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEdit = (member: CommitteeMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = (member: CommitteeMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      await deleteMember.mutateAsync(memberToDelete.id);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const getCommitteeTypeName = (typeId: number) => {
    return committeeTypes?.find((t) => t.id === typeId)?.committee_name || 'Unknown';
  };

  // Filter members by committee type
  const filteredMembers = selectedCommitteeType
    ? members?.filter((m) => m.committee_type_id === selectedCommitteeType)
    : members;

  if (loadingEditions) {
    return <div className="p-6">Loading editions...</div>;
  }

  if (!editions || editions.length === 0) {
    return (
      <div className="p-6">
        <p>No editions available. Please create an edition first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Committee Members</h1>
          <p className="text-gray-600 mt-1">
            Manage committee members for conference editions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Edition:</label>
        <Select
          value={selectedEditionId?.toString()}
          onValueChange={(value) => setSelectedEditionId(Number(value))}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {editions.map((edition) => (
              <SelectItem key={edition.id} value={edition.id.toString()}>
                {edition.year} - {edition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Filter by Committee Type:</label>
        <div className="flex gap-2">
          <Button
            variant={selectedCommitteeType === null ? 'default' : 'outline'}
            onClick={() => setSelectedCommitteeType(null)}
            size="sm"
          >
            All
          </Button>
          {committeeTypes?.map((type) => (
            <Button
              key={type.id}
              variant={selectedCommitteeType === type.id ? 'default' : 'outline'}
              onClick={() => setSelectedCommitteeType(type.id)}
              size="sm"
            >
              {type.committee_name}
            </Button>
          ))}
        </div>
      </div>

      {loadingMembers ? (
        <div>Loading committee members...</div>
      ) : !filteredMembers || filteredMembers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No committee members</h3>
          <p className="text-gray-600 mb-4">
            {selectedCommitteeType
              ? 'No members found for this committee type'
              : 'Get started by adding your first committee member'}
          </p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Committee</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.full_name}</span>
                      {member.is_international && (
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Intl
                        </Badge>
                      )}
                    </div>
                    {member.country && (
                      <div className="text-xs text-gray-500">{member.country}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCommitteeTypeName(member.committee_type_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>{member.designation}</div>
                    {member.department && (
                      <div className="text-xs text-gray-500">{member.department}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{member.affiliation}</TableCell>
                  <TableCell>
                    <div>{member.role}</div>
                    {member.role_category && (
                      <div className="text-xs text-gray-500">{member.role_category}</div>
                    )}
                  </TableCell>
                  <TableCell>{member.display_order}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(member)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CommitteeMemberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Committee Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberToDelete?.full_name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useRegistrationFees, useDeleteRegistrationFee } from '@/hooks/useRegistrationFees';
import type { RegistrationFee } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Plus, MoreVertical, Pencil, Trash2, DollarSign } from 'lucide-react';
import RegistrationFeeFormDialog from './RegistrationFeeFormDialog';

export default function RegistrationFeesPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: fees, isLoading: loadingFees } = useRegistrationFees(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<RegistrationFee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<RegistrationFee | null>(null);

  const deleteFee = useDeleteRegistrationFee(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingFee(null);
    setDialogOpen(true);
  };

  const handleEdit = (fee: RegistrationFee) => {
    setEditingFee(fee);
    setDialogOpen(true);
  };

  const handleDelete = (fee: RegistrationFee) => {
    setFeeToDelete(fee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (feeToDelete) {
      await deleteFee.mutateAsync(feeToDelete.id);
      setDeleteDialogOpen(false);
      setFeeToDelete(null);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (currency === 'USD' || currency === 'EUR') {
      return `${currency === 'USD' ? '$' : '€'}${numAmount.toFixed(2)}`;
    }
    return `${currency} ${numAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

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
          <h1 className="text-2xl font-bold">Registration Fees</h1>
          <p className="text-gray-600 mt-1">
            Manage conference registration pricing
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Fee
        </Button>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Edition:</label>
        <Select
          value={selectedEditionId?.toString() || ''}
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

      {loadingFees ? (
        <div>Loading registration fees...</div>
      ) : !fees || fees.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registration fees</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first registration fee</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee Type</TableHead>
                <TableHead>Regular Amount</TableHead>
                <TableHead>Early Bird Amount</TableHead>
                <TableHead>Early Bird Deadline</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee, index) => (
                <TableRow key={fee.id ? `fee-${fee.id}` : `fee-idx-${index}`}>
                  <TableCell className="font-medium">{fee.attendee_type}</TableCell>
                  <TableCell>{formatAmount(fee.amount, fee.currency)}</TableCell>
                  <TableCell>
                    {fee.early_bird_amount
                      ? formatAmount(fee.early_bird_amount, fee.currency)
                      : '-'}
                  </TableCell>
                  <TableCell>{formatDate(fee.early_bird_deadline)}</TableCell>
                  <TableCell>{fee.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={fee.is_active ? 'default' : 'secondary'}>
                      {fee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(fee)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Fee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(fee)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Fee
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

      <RegistrationFeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fee={editingFee}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration Fee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this registration fee for "{feeToDelete?.attendee_type}"? This action cannot be undone.
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

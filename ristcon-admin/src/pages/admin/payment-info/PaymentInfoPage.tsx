import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { usePaymentInfo, useDeletePaymentInfo } from '@/hooks/usePaymentInfo';
import type { PaymentInformation } from '@/types/api';
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
import { Plus, MoreVertical, Pencil, Trash2, CreditCard } from 'lucide-react';
import PaymentInfoFormDialog from './PaymentInfoFormDialog';

export default function PaymentInfoPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: payments, isLoading: loadingPayments } = usePaymentInfo(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentInformation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentInformation | null>(null);

  const deletePayment = useDeletePaymentInfo(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingPayment(null);
    setDialogOpen(true);
  };

  const handleEdit = (payment: PaymentInformation) => {
    setEditingPayment(payment);
    setDialogOpen(true);
  };

  const handleDelete = (payment: PaymentInformation) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (paymentToDelete) {
      // Use payment_id as fallback for older cached responses
      const paymentId = paymentToDelete.id || (paymentToDelete as any).payment_id;
      await deletePayment.mutateAsync(paymentId);
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
    }
  };

  const maskAccountNumber = (accountNumber: string | null | undefined) => {
    if (!accountNumber) return '-';
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
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
          <h1 className="text-2xl font-bold">Payment Information</h1>
          <p className="text-gray-600 mt-1">
            Manage conference bank and payment details
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Info
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

      {loadingPayments ? (
        <div>Loading payment information...</div>
      ) : !payments || payments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment information</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first payment account</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Info
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Type</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={payment.id ? `payment-${payment.id}` : `payment-idx-${index}`}>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.payment_type === 'local' ? 'Local' : 'Foreign'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{payment.beneficiary_name}</TableCell>
                  <TableCell>{payment.bank_name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {maskAccountNumber(payment.account_number)}
                  </TableCell>
                  <TableCell>{payment.currency || '-'}</TableCell>
                  <TableCell>{payment.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={payment.is_active ? 'default' : 'secondary'}>
                      {payment.is_active ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleEdit(payment)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Payment Info
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(payment)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Payment Info
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

      <PaymentInfoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payment={editingPayment}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Information</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment information for "{paymentToDelete?.beneficiary_name}"? This action cannot be undone.
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

import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useSubmissionMethods, useDeleteSubmissionMethod } from '@/hooks/useSubmissionMethods';
import type { SubmissionMethod } from '@/types/api';
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
import { Plus, MoreVertical, Pencil, Trash2, Send } from 'lucide-react';
import SubmissionMethodFormDialog from './SubmissionMethodFormDialog';

const methodLabels: Record<string, string> = {
  email: 'Email',
  cmt_upload: 'CMT Upload',
  online_form: 'Online Form',
  postal: 'Postal',
};

const documentLabels: Record<string, string> = {
  author_info: 'Author Info',
  abstract: 'Abstract',
  extended_abstract: 'Extended Abstract',
  camera_ready: 'Camera Ready',
  other: 'Other',
};

export default function SubmissionMethodsPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: methods, isLoading: loadingMethods } = useSubmissionMethods(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<SubmissionMethod | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<SubmissionMethod | null>(null);

  const deleteMethod = useDeleteSubmissionMethod(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingMethod(null);
    setDialogOpen(true);
  };

  const handleEdit = (method: SubmissionMethod) => {
    setEditingMethod(method);
    setDialogOpen(true);
  };

  const handleDelete = (method: SubmissionMethod) => {
    setMethodToDelete(method);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (methodToDelete) {
      await deleteMethod.mutateAsync(methodToDelete.id);
      setDeleteDialogOpen(false);
      setMethodToDelete(null);
    }
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
          <h1 className="text-2xl font-bold">Submission Methods</h1>
          <p className="text-gray-600 mt-1">
            Manage conference paper and document submission channels
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Submission Method
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

      {loadingMethods ? (
        <div>Loading submission methods...</div>
      ) : !methods || methods.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submission methods</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first submission method</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Submission Method
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Submission Method</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method, index) => (
                <TableRow key={method.id ? `method-${method.id}` : `method-idx-${index}`}>
                  <TableCell>
                    <Badge variant="outline">
                      {documentLabels[method.document_type] || method.document_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {methodLabels[method.submission_method] || method.submission_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {method.email_address ? (
                      <a
                        href={`mailto:${method.email_address}`}
                        className="text-blue-600 hover:underline"
                      >
                        {method.email_address}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {method.notes || '-'}
                  </TableCell>
                  <TableCell>{method.display_order}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(method)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Method
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(method)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Method
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

      <SubmissionMethodFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        method={editingMethod}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission method? This action cannot be undone.
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

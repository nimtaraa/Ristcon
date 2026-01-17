import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useDates, useDeleteDate } from '@/hooks/useDates';
import { useEditions } from '@/hooks/useEditions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ImportantDate } from '@/types/api';
import DateFormDialog from './DateFormDialog';

export default function DatesPage() {
  const { data: editions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  
  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEditionId]);
  
  const { data: dates, isLoading } = useDates(selectedEditionId);
  const deleteDate = useDeleteDate(selectedEditionId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<ImportantDate | null>(null);

  const handleEdit = (date: ImportantDate) => {
    setEditingDate(date);
    setIsFormOpen(true);
  };

  const handleDelete = (date: ImportantDate) => {
    setDateToDelete(date);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (dateToDelete) {
      await deleteDate.mutateAsync(dateToDelete.id);
      setDeleteDialogOpen(false);
      setDateToDelete(null);
    }
  };

  const getDateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      submission_deadline: 'Submission Deadline',
      notification: 'Notification',
      camera_ready: 'Camera Ready',
      conference_date: 'Conference Date',
      registration_deadline: 'Registration Deadline',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getDateTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      submission_deadline: 'bg-red-100 text-red-800',
      notification: 'bg-blue-100 text-blue-800',
      camera_ready: 'bg-orange-100 text-orange-800',
      conference_date: 'bg-purple-100 text-purple-800',
      registration_deadline: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDateStatus = (dateValue: string) => {
    const date = new Date(dateValue);
    const now = new Date();
    const isPast = date < now;
    const daysRemaining = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { isPast, daysRemaining };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!editions || editions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No editions available. Create an edition first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Important Dates</h1>
          <p className="text-gray-600 mt-1">Manage deadlines and key dates for the conference</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedEditionId?.toString()}
            onValueChange={(value) => setSelectedEditionId(parseInt(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Edition" />
            </SelectTrigger>
            <SelectContent>
              {editions.map((edition) => (
                <SelectItem key={edition.id} value={edition.id.toString()}>
                  {edition.year} - {edition.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditingDate(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Date
          </Button>
        </div>
      </div>

      {/* Dates Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : dates && dates.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dates.map((date: ImportantDate) => {
                const { isPast, daysRemaining } = getDateStatus(date.date_value);
                
                return (
                  <TableRow key={date.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{date.display_label}</div>
                          {date.is_extended && date.original_date && (
                            <div className="text-xs text-orange-600">
                              Extended from {formatDate(date.original_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDateTypeColor(date.date_type)}>
                        {getDateTypeLabel(date.date_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatDate(date.date_value)}</div>
                    </TableCell>
                    <TableCell>
                      {isPast ? (
                        <div className="flex items-center gap-1 text-gray-500">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Passed</span>
                        </div>
                      ) : daysRemaining <= 7 ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{daysRemaining} days left</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{daysRemaining} days left</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {date.notes && (
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {date.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-md">
                          <DropdownMenuItem onClick={() => handleEdit(date)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Date
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(date)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dates yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first important date for this edition.
          </p>
          <Button
            onClick={() => {
              setEditingDate(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Date
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      {selectedEditionId && (
        <DateFormDialog
          open={isFormOpen}
          onOpenChange={(open: boolean) => {
            setIsFormOpen(open);
            if (!open) setEditingDate(null);
          }}
          date={editingDate}
          editionId={selectedEditionId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Important Date</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{dateToDelete?.display_label}</strong>?
              This action cannot be undone.
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

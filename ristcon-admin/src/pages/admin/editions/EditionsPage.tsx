import { useState } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, CheckCircle, Archive, FileText, FileMinus } from 'lucide-react';
import { useEditions, useDeleteEdition, useActivateEdition, usePublishEdition, useArchiveEdition, useDraftEdition } from '@/hooks/useEditions';
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
import type { ConferenceEdition } from '@/types/api';
import EditionFormDialog from './EditionFormDialog.tsx';

export default function EditionsPage() {
  const { data: editions, isLoading } = useEditions();
  const deleteEdition = useDeleteEdition();
  const activateEdition = useActivateEdition();
  const publishEdition = usePublishEdition();
  const archiveEdition = useArchiveEdition();
  const draftEdition = useDraftEdition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<ConferenceEdition | null>(null);
  const [deletingEdition, setDeletingEdition] = useState<ConferenceEdition | null>(null);

  const handleEdit = (edition: ConferenceEdition) => {
    setEditingEdition(edition);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingEdition(null);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingEdition) {
      await deleteEdition.mutateAsync(deletingEdition.id);
      setDeletingEdition(null);
    }
  };

  const handleActivate = async (id: number) => {
    await activateEdition.mutateAsync(id);
  };

  const handlePublish = async (id: number) => {
    await publishEdition.mutateAsync(id);
  };

  const handleArchive = async (id: number) => {
    await archiveEdition.mutateAsync(id);
  };

  const handleDraft = async (id: number) => {
    await draftEdition.mutateAsync(id);
  };

  const handlePreview = (year: number) => {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost';
    window.open(`${frontendUrl}/ristcon/${year}`, '_blank');
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-500">Active</Badge>;
    }

    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Conference Editions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all conference editions (years). Create new editions, edit existing ones, and set the active edition.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Edition
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Year</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-40">Conference Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editions?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No editions found. Create your first edition to get started.
                      </TableCell>
                    </TableRow>
                  )}
                  {editions?.map((edition) => (
                    <TableRow key={edition.id}>
                      <TableCell className="font-medium">{edition.year}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{edition.name}</div>
                          <div className="text-sm text-gray-500">{edition.theme}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(edition.status, edition.is_active_edition)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(edition.conference_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div>{edition.venue_type}</div>
                        {edition.venue_location && (
                          <div className="text-xs text-gray-400 truncate max-w-xs">
                            {edition.venue_location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border shadow-md">
                            <DropdownMenuItem onClick={() => handlePreview(edition.year)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Site
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(edition)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!edition.is_active_edition && edition.status === 'published' && (
                              <DropdownMenuItem onClick={() => handleActivate(edition.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Set as Active
                              </DropdownMenuItem>
                            )}
                            {edition.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handlePublish(edition.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            {(edition.status === 'published' || edition.status === 'archived') && !edition.is_active_edition && (
                              <DropdownMenuItem onClick={() => handleDraft(edition.id)}>
                                <FileMinus className="mr-2 h-4 w-4" />
                                Set as Draft
                              </DropdownMenuItem>
                            )}
                            {edition.status === 'published' && !edition.is_active_edition && (
                              <DropdownMenuItem onClick={() => handleArchive(edition.id)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeletingEdition(edition)}
                              disabled={edition.is_active_edition}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <EditionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        edition={editingEdition}
      />

      <AlertDialog open={!!deletingEdition} onOpenChange={() => setDeletingEdition(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deletingEdition?.year} edition and all its associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

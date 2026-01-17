import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { usePresentationGuidelines, useDeletePresentationGuideline } from '@/hooks/usePresentationGuidelines';
import type { PresentationGuideline } from '@/types/api';
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
import { Plus, MoreVertical, Pencil, Trash2, Presentation } from 'lucide-react';
import PresentationGuidelineFormDialog from './PresentationGuidelineFormDialog';

const typeLabels: Record<string, string> = {
  oral: 'Oral',
  poster: 'Poster',
  workshop: 'Workshop',
  panel: 'Panel',
};

export default function PresentationGuidelinesPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: guidelines, isLoading: loadingGuidelines } = usePresentationGuidelines(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<PresentationGuideline | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState<PresentationGuideline | null>(null);

  const deleteGuideline = useDeletePresentationGuideline(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingGuideline(null);
    setDialogOpen(true);
  };

  const handleEdit = (guideline: PresentationGuideline) => {
    setEditingGuideline(guideline);
    setDialogOpen(true);
  };

  const handleDelete = (guideline: PresentationGuideline) => {
    setGuidelineToDelete(guideline);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (guidelineToDelete) {
      await deleteGuideline.mutateAsync(guidelineToDelete.id);
      setDeleteDialogOpen(false);
      setGuidelineToDelete(null);
    }
  };

  const formatDuration = (presentation: PresentationGuideline) => {
    const parts = [];
    if (presentation.presentation_minutes) {
      parts.push(`${presentation.presentation_minutes}m presentation`);
    }
    if (presentation.qa_minutes) {
      parts.push(`${presentation.qa_minutes}m Q&A`);
    }
    return parts.length > 0 ? parts.join(' + ') : '-';
  };

  const formatPosterSize = (guideline: PresentationGuideline) => {
    if (guideline.poster_width && guideline.poster_height) {
      const unit = guideline.poster_unit || 'cm';
      return `${guideline.poster_width} × ${guideline.poster_height} ${unit}`;
    }
    return '-';
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
          <h1 className="text-2xl font-bold">Presentation Guidelines</h1>
          <p className="text-gray-600 mt-1">
            Manage conference presentation requirements and specifications
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Guideline
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

      {loadingGuidelines ? (
        <div>Loading presentation guidelines...</div>
      ) : !guidelines || guidelines.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Presentation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No presentation guidelines</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first presentation guideline</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Guideline
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Presentation Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Poster Size</TableHead>
                <TableHead>Physical Presence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guidelines.map((guideline, index) => (
                <TableRow key={guideline.id ? `guideline-${guideline.id}` : `guideline-idx-${index}`}>
                  <TableCell>
                    <Badge variant="outline">
                      {typeLabels[guideline.presentation_type] || guideline.presentation_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDuration(guideline)}</TableCell>
                  <TableCell>{formatPosterSize(guideline)}</TableCell>
                  <TableCell>
                    {guideline.physical_presence_required ? (
                      <Badge variant="default">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
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
                        <DropdownMenuItem onClick={() => handleEdit(guideline)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Guideline
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(guideline)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Guideline
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

      <PresentationGuidelineFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guideline={editingGuideline}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation Guideline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this presentation guideline? This action cannot be undone.
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

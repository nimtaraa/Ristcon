import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Trash2, X, User } from 'lucide-react';
import { useSpeakers, useDeleteSpeaker, useDeleteSpeakerPhoto } from '@/hooks/useSpeakers';
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
import type { Speaker } from '@/types/api';
import SpeakerFormDialog from './SpeakerFormDialog';

export default function SpeakersPage() {
  const { data: editions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);

  // Set initial edition when editions load
  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEditionId]);

  const { data: speakers, isLoading } = useSpeakers(selectedEditionId);
  const deleteSpeaker = useDeleteSpeaker(selectedEditionId);
  const deletePhoto = useDeleteSpeakerPhoto(selectedEditionId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<Speaker | null>(null);

  const handleEdit = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setIsFormOpen(true);
  };

  const handleDelete = (speaker: Speaker) => {
    setSpeakerToDelete(speaker);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (speakerToDelete) {
      await deleteSpeaker.mutateAsync(speakerToDelete.id);
      setDeleteDialogOpen(false);
      setSpeakerToDelete(null);
    }
  };

  const handlePhotoDelete = async (speakerId: number) => {
    await deletePhoto.mutateAsync(speakerId);
  };

  const getSpeakerTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-purple-100 text-purple-800';
      case 'plenary': return 'bg-blue-100 text-blue-800';
      case 'invited': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpeakerTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
          <h1 className="text-3xl font-bold">Speakers</h1>
          <p className="text-gray-600 mt-1">Manage keynote, plenary, and invited speakers</p>
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
              setEditingSpeaker(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Speaker
          </Button>
        </div>
      </div>

      {/* Speakers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : speakers && speakers.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speakers.map((speaker: Speaker) => (
                <TableRow key={speaker.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {speaker.photo_url ? (
                        <img
                          src={speaker.photo_url}
                          alt={speaker.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{speaker.full_name}</div>
                      {speaker.title && (
                        <div className="text-sm text-gray-500">{speaker.title}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSpeakerTypeColor(speaker.speaker_type)}>
                      {getSpeakerTypeLabel(speaker.speaker_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm">{speaker.affiliation}</div>
                      {speaker.additional_affiliation && (
                        <div className="text-xs text-gray-500">
                          {speaker.additional_affiliation}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {speaker.email && (
                        <div className="text-gray-600">{speaker.email}</div>
                      )}
                      {speaker.website_url && (
                        <a
                          href={speaker.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border shadow-md">
                        <DropdownMenuItem onClick={() => handleEdit(speaker)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Speaker
                        </DropdownMenuItem>
                        {speaker.photo_filename && (
                          <DropdownMenuItem
                            onClick={() => handlePhotoDelete(speaker.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove Photo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(speaker)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No speakers yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first speaker for this edition.
          </p>
          <Button
            onClick={() => {
              setEditingSpeaker(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Speaker
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      {selectedEditionId && (
        <SpeakerFormDialog
          open={isFormOpen}
          onOpenChange={(open: boolean) => {
            setIsFormOpen(open);
            if (!open) setEditingSpeaker(null);
          }}
          speaker={editingSpeaker}
          editionId={selectedEditionId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Speaker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{speakerToDelete?.full_name}</strong>?
              This action cannot be undone and will also delete their photo.
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

import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useLocations, useDeleteLocation } from '@/hooks/useLocations';
import type { EventLocation } from '@/types/api';
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
import { Plus, MoreVertical, Pencil, Trash2, MapPin, ExternalLink } from 'lucide-react';
import LocationFormDialog from './LocationFormDialog';

export default function LocationsPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: locations, isLoading: loadingLocations } = useLocations(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<EventLocation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<EventLocation | null>(null);

  const deleteLocation = useDeleteLocation(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingLocation(null);
    setDialogOpen(true);
  };

  const handleEdit = (location: EventLocation) => {
    setEditingLocation(location);
    setDialogOpen(true);
  };

  const handleDelete = (location: EventLocation) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      await deleteLocation.mutateAsync(locationToDelete.id);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
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
          <h1 className="text-2xl font-bold">Event Locations</h1>
          <p className="text-gray-600 mt-1">
            Manage conference venue information
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
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

      {loadingLocations ? (
        <div>Loading locations...</div>
      ) : !locations || locations.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first event location</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City/Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Maps</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location, index) => (
                <TableRow key={location.id ? `location-${location.id}` : `location-idx-${index}`}>
                  <TableCell className="font-medium">{location.venue_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{location.full_address}</TableCell>
                  <TableCell>
                    {location.city}, {location.country}
                  </TableCell>
                  <TableCell>
                    <Badge variant={location.is_virtual ? 'secondary' : 'default'}>
                      {location.is_virtual ? 'Virtual' : 'Physical'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {location.google_maps_link && (
                      <a
                        href={location.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Map
                      </a>
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
                        <DropdownMenuItem onClick={() => handleEdit(location)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Location
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(location)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Location
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

      <LocationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        location={editingLocation}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{locationToDelete?.venue_name}"? This action cannot be undone.
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

import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useSocialMedia, useDeleteSocialMedia } from '@/hooks/useSocialMedia';
import type { SocialMediaLink } from '@/types/api';
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
import { Plus, MoreVertical, Pencil, Trash2, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, ExternalLink } from 'lucide-react';
import SocialMediaFormDialog from './SocialMediaFormDialog';

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
};

export default function SocialMediaPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: socialMedia, isLoading: loadingSocialMedia } = useSocialMedia(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialMediaLink | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<SocialMediaLink | null>(null);

  const deleteLink = useDeleteSocialMedia(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingLink(null);
    setDialogOpen(true);
  };

  const handleEdit = (link: SocialMediaLink) => {
    setEditingLink(link);
    setDialogOpen(true);
  };

  const handleDelete = (link: SocialMediaLink) => {
    setLinkToDelete(link);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (linkToDelete) {
      await deleteLink.mutateAsync(linkToDelete.id);
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const Icon = platformIcons[platform];
    return Icon ? <Icon className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />;
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
          <h1 className="text-2xl font-bold">Social Media Links</h1>
          <p className="text-gray-600 mt-1">
            Manage conference social media presence
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
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

      {loadingSocialMedia ? (
        <div>Loading social media links...</div>
      ) : !socialMedia || socialMedia.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No social media links</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first social media link</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialMedia.map((link, index) => (
                <TableRow key={link.id ? `social-${link.id}` : `social-idx-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(link.platform)}
                      <span className="font-medium capitalize">{link.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline max-w-xs truncate block"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>{link.label || '-'}</TableCell>
                  <TableCell>{link.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={link.is_active ? 'default' : 'secondary'}>
                      {link.is_active ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleEdit(link)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(link)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Link
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

      <SocialMediaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        link={editingLink}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Social Media Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {linkToDelete?.platform} link? This action cannot be undone.
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

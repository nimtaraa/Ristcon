import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useAssets, useDeleteAsset } from '@/hooks/useAssets';
import type { ConferenceAsset } from '@/types/api';
import { Button } from '@/components/ui/button';
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
import { Card } from '@/components/ui/card';
import { Plus, MoreVertical, Pencil, Trash2, Image as ImageIcon, Download } from 'lucide-react';
import AssetFormDialog from './AssetFormDialog';

export default function AssetsPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(() => {
    return null;
  });
  const { data: assets, isLoading: loadingAssets } = useAssets(selectedEditionId);
  const [filterType, setFilterType] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<ConferenceAsset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<ConferenceAsset | null>(null);

  const deleteAsset = useDeleteAsset(selectedEditionId || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      // Use setTimeout to avoid cascading renders
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleAdd = () => {
    setEditingAsset(null);
    setDialogOpen(true);
  };

  const handleEdit = (asset: ConferenceAsset) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleDelete = (asset: ConferenceAsset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (assetToDelete) {
      await deleteAsset.mutateAsync(assetToDelete.id);
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  const getAssetTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      logo: 'bg-blue-100 text-blue-800',
      poster: 'bg-purple-100 text-purple-800',
      banner: 'bg-green-100 text-green-800',
      brochure: 'bg-orange-100 text-orange-800',
      image: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.other;
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      logo: 'Logo',
      poster: 'Poster',
      banner: 'Banner',
      brochure: 'Brochure',
      image: 'Image',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssets = filterType
    ? assets?.filter((a) => a.asset_type === filterType)
    : assets;

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
          <h1 className="text-2xl font-bold">Conference Assets</h1>
          <p className="text-gray-600 mt-1">
            Manage logos, banners, posters, and other visual assets
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
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

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Filter by Type:</label>
        <div className="flex gap-2">
          <Button
            variant={filterType === null ? 'default' : 'outline'}
            onClick={() => setFilterType(null)}
            size="sm"
          >
            All
          </Button>
          {['logo', 'poster', 'banner', 'brochure', 'image', 'other'].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              size="sm"
            >
              {getAssetTypeLabel(type)}
            </Button>
          ))}
        </div>
      </div>

      {loadingAssets ? (
        <div>Loading assets...</div>
      ) : !filteredAssets || filteredAssets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets</h3>
          <p className="text-gray-600 mb-4">
            {filterType
              ? `No ${getAssetTypeLabel(filterType).toLowerCase()} assets found`
              : 'Get started by uploading your first asset'}
          </p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Upload First Asset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative group">
                {asset.asset_url ? (
                  <img
                    src={asset.asset_url}
                    alt={asset.alt_text || asset.file_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <a
                      href={asset.asset_url}
                      download={asset.file_name}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getAssetTypeBadgeColor(asset.asset_type)}>
                    {getAssetTypeLabel(asset.asset_type)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(asset)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Asset
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(asset)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Asset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-medium text-sm mb-1 truncate" title={asset.file_name}>
                  {asset.file_name}
                </h3>
                {asset.alt_text && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{asset.alt_text}</p>
                )}
                {asset.usage_context && (
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Usage:</span> {asset.usage_context}
                  </p>
                )}
                <div className="text-xs text-gray-500">
                  {formatFileSize(asset.file_size)} • {asset.mime_type}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AssetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={editingAsset}
        editionId={selectedEditionId || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{assetToDelete?.file_name}"? This action cannot be
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

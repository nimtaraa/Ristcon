import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Trash2, FileText, Download, Upload, Eye } from 'lucide-react';
import { useDocuments, useDeleteDocument, useUploadDocumentFile } from '@/hooks/useDocuments';
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
import type { ConferenceDocument } from '@/types/api';
import DocumentFormDialog from './DocumentFormDialog';

export default function DocumentsPage() {
  const { data: editions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  
  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEditionId]);
  
  const { data: documents, isLoading } = useDocuments(selectedEditionId);
  const deleteDocument = useDeleteDocument(selectedEditionId);
  const uploadFile = useUploadDocumentFile(selectedEditionId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ConferenceDocument | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<ConferenceDocument | null>(null);

  const handleEdit = (document: ConferenceDocument) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleDelete = (document: ConferenceDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      await deleteDocument.mutateAsync(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleFileUpload = async (documentId: number, file: File) => {
    await uploadFile.mutateAsync({ id: documentId, file });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      abstract_template: 'Abstract Template',
      author_form: 'Author Form',
      registration_form: 'Registration Form',
      presentation_template: 'Presentation Template',
      camera_ready_template: 'Camera Ready Template',
      flyer: 'Flyer',
      other: 'Other',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      abstract_template: 'bg-blue-100 text-blue-800',
      author_form: 'bg-green-100 text-green-800',
      registration_form: 'bg-purple-100 text-purple-800',
      presentation_template: 'bg-orange-100 text-orange-800',
      camera_ready_template: 'bg-red-100 text-red-800',
      flyer: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
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
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600 mt-1">Manage templates, forms, and other conference documents</p>
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
              setEditingDocument(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : documents && documents.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document: ConferenceDocument) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div className="font-medium">{document.display_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(document.document_category)}>
                      {getCategoryLabel(document.document_category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{document.file_name}</div>
                      <div className="text-gray-500">{formatFileSize(document.file_size)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {document.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
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
                        {document.download_url && (
                          <>
                            <DropdownMenuItem asChild>
                              <a href={document.download_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={document.download_url} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(document)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <label className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Replace File
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(document.id, file);
                              }}
                            />
                          </label>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(document)}
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
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first document for this edition.
          </p>
          <Button
            onClick={() => {
              setEditingDocument(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Document
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      {selectedEditionId && (
        <DocumentFormDialog
          open={isFormOpen}
          onOpenChange={(open: boolean) => {
            setIsFormOpen(open);
            if (!open) setEditingDocument(null);
          }}
          document={editingDocument}
          editionId={selectedEditionId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{documentToDelete?.display_name}</strong>?
              This will also delete the associated file and cannot be undone.
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

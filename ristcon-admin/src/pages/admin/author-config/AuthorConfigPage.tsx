import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import { useAuthorConfig } from '@/hooks/useAuthorConfig';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileEdit, Pencil } from 'lucide-react';
import AuthorConfigFormDialog from './AuthorConfigFormDialog';

export default function AuthorConfigPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: config, isLoading: loadingConfig } = useAuthorConfig(selectedEditionId);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      const timer = setTimeout(() => {
        setSelectedEditionId(editions[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editions, selectedEditionId]);

  const handleEdit = () => {
    setDialogOpen(true);
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
          <h1 className="text-2xl font-bold">Author Page Configuration</h1>
          <p className="text-gray-600 mt-1">
            Configure author guidelines and submission settings
          </p>
        </div>
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

      {loadingConfig ? (
        <div>Loading author configuration...</div>
      ) : !config ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileEdit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No configuration found</h3>
          <p className="text-gray-600 mb-4">Create author page configuration for this edition</p>
          <Button onClick={handleEdit}>
            <FileEdit className="w-4 h-4 mr-2" />
            Create Configuration
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold">Configuration Details</h2>
              <Button onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Configuration
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Conference Format</label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {config.conference_format.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">CMT URL</label>
                <div className="mt-1">
                  {config.cmt_url ? (
                    <a
                      href={config.cmt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {config.cmt_url}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Submission Email</label>
                <div className="mt-1">
                  {config.submission_email ? (
                    <a
                      href={`mailto:${config.submission_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {config.submission_email}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Review Options</label>
                <div className="mt-1 flex gap-2">
                  {config.blind_review_enabled && (
                    <Badge variant="secondary">Blind Review Enabled</Badge>
                  )}
                  {config.camera_ready_required && (
                    <Badge variant="secondary">Camera Ready Required</Badge>
                  )}
                  {!config.blind_review_enabled && !config.camera_ready_required && (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {config.special_instructions && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Special Instructions</label>
                <div className="mt-2 p-4 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                  {config.special_instructions}
                </div>
              </div>
            )}

            {config.acknowledgment_text && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Acknowledgment Text</label>
                <div className="mt-2 p-4 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                  {config.acknowledgment_text}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthorConfigFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={config}
        editionId={selectedEditionId || 0}
      />
    </div>
  );
}

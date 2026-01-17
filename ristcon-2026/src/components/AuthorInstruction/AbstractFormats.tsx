import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useConference } from "@/hooks/useConference";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AbstractFormats = () => {
  const { data: conference, isLoading, error } = useConference(undefined, 'abstract_formats');

  // Loading state
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load abstract format information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const formats = conference?.abstract_formats || [];
  const abstractFormat = formats.find(f => f.format_type === 'abstract');
  const extendedFormat = formats.find(f => f.format_type === 'extended_abstract');

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Abstract Format */}
      {abstractFormat && (
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl">Abstract Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {abstractFormat.max_title_characters && (
                <div className="bg-muted/50 rounded-lg p-1">
                  <p className="font-semibold text-sm text-primary mb-1">Title</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum {abstractFormat.max_title_characters} characters with spaces, {abstractFormat.title_font_name} {abstractFormat.title_font_size}, {abstractFormat.title_style}
                  </p>
                </div>
              )}

              {abstractFormat.max_body_words && (
                <div className="bg-muted/50 rounded-lg p-1">
                  <p className="font-semibold text-sm text-primary mb-1">Abstract Body</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of words in the text {abstractFormat.max_body_words}, no citations, {abstractFormat.body_font_name} {abstractFormat.body_font_size}, {abstractFormat.body_line_spacing} spacing
                  </p>
                </div>
              )}

              {abstractFormat.max_keywords && (
                <div className="bg-muted/50 rounded-lg p-1">
                  <p className="font-semibold text-sm text-primary mb-1">Keywords</p>
                  <p className="text-sm text-muted-foreground">
                    Max {abstractFormat.max_keywords} keywords, {abstractFormat.keywords_font_name} {abstractFormat.keywords_font_size}, {abstractFormat.keywords_style}
                  </p>
                </div>
              )}
            </div>

            {abstractFormat.additional_notes && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-medium text-destructive flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {abstractFormat.additional_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extended Abstract Format */}
      {extendedFormat && (
        <Card className="border-t-4 border-t-blue-900">
          <CardHeader>
            <CardTitle className="text-xl">Extended Abstract Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {extendedFormat.sections && extendedFormat.sections.length > 0 && (
              <ul className="space-y-2 text-sm">
                {extendedFormat.sections.map((section, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    <span>
                      {section}
                      {section === 'References' && extendedFormat.max_references ? ` (max ${extendedFormat.max_references})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {extendedFormat.additional_notes && (
              <p className="text-xs text-muted-foreground mt-3 italic">
                {extendedFormat.additional_notes}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AbstractFormats;

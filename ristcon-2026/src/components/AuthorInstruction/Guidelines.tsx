import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Presentation, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PresentationGuidelines = () => {
  const { data, isLoading, isError } = useAuthorInstructions();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>Failed to load presentation guidelines.</AlertDescription>
      </Alert>
    );
  }

  const oralGuideline = data.presentation_guidelines.find(g => g.presentation_type === 'oral');
  const posterGuideline = data.presentation_guidelines.find(g => g.presentation_type === 'poster');

  return (
  <div className="grid md:grid-cols-2 gap-6 ">
    
    <Card className="border-l-4 border-l-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ImageIcon className="w-5 h-5 text-black" />
          Poster Presentations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posterGuideline && (
          <>
            <div className="bg-accent/10 rounded-lg p-3 text-sm">
              <p className="font-semibold mb-2">Poster Specifications:</p>
              <p className="mb-2">
                Size: {posterGuideline.poster_width}" × {posterGuideline.poster_height}" ({posterGuideline.poster_orientation || 'Portrait'})
              </p>
              <p className="whitespace-pre-line text-xs">{posterGuideline.detailed_requirements}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>

    <Card className="border-l-4 border-l-primary self-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Presentation className="w-5 h-5 text-primary" />
          Oral Presentations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {oralGuideline && (
          <>
            {oralGuideline.physical_presence_required && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <span>Presenters must be physically present.</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <span>{oralGuideline.presentation_minutes}-minute presentation + {oralGuideline.qa_minutes}-minute Q&A.</span>
            </div>
            {oralGuideline.detailed_requirements && (
              <p className="text-sm text-muted-foreground mt-3">
                {oralGuideline.detailed_requirements}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>

  </div>
  );
};

export default PresentationGuidelines;

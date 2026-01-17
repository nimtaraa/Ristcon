import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";

const Downloads = () => {
  const { data: documentsData, isLoading: docsLoading, isError: docsError } = useDocuments();
  const { data: authorData, isLoading: authorLoading } = useAuthorInstructions();
  
  const isLoading = docsLoading || authorLoading;
  const documents = documentsData?.data || [];
  const cmtUrl = authorData?.config?.cmt_url;

  if (docsError) {
    return (
      <Card className="border-2 border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">Failed to load downloads. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Download className="w-6 h-6 text-primary" />
            Downloads & Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find specific documents by category
  const abstractTemplate = documents.find(doc => doc.category === 'abstract_template');
  const authorForm = documents.find(doc => doc.category === 'author_form');

  return (
    <Card className="border-2 border-primary">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Download className="w-6 h-6 text-primary" />
          Downloads & Submission
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid md:grid-cols-3 gap-4">
          {abstractTemplate && (
            <a href={abstractTemplate.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full flex flex-col items-center gap-2 py-8 bg-primary hover:bg-blue-950">
                {abstractTemplate.icon && <abstractTemplate.icon className="w-8 h-8" />}
                {abstractTemplate.title}
              </Button>
            </a>
          )}
          
          {authorForm && (
            <a href={authorForm.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full flex flex-col items-center gap-2 py-8 bg-primary hover:bg-blue-950">
                {authorForm.icon && <authorForm.icon className="w-8 h-8" />}
                {authorForm.title}
              </Button>
            </a>
          )}
          
          {cmtUrl && (
            <a href={cmtUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full flex flex-col items-center gap-2 py-8 bg-primary hover:bg-blue-950">
                <Download className="w-8 h-8" />
                Submit Abstract (CMT)
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Downloads;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Mail } from "lucide-react";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SubmissionRequirements = () => {
  const { data, isLoading, isError } = useAuthorInstructions();

  if (isLoading) {
    return (
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>Failed to load submission requirements.</AlertDescription>
      </Alert>
    );
  }

  const config = data.config;
  const submissionMethods = data.submission_methods;
  const cmtMethod = submissionMethods.find(m => m.submission_method === 'cmt_upload');
  const emailMethod = submissionMethods.find(m => m.submission_method === 'email');

  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-blue-950">
          <FileText className="w-6 h-6 text-blue-950" />
          Submission Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-foreground">Authors must submit the following documents:</p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Abstract & Extended Abstract should be submitted in <strong>two separate files</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>
                Submit at{" "}
                <a href={config.cmt_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-primary hover:text-accent underline font-medium">
                  Microsoft CMT
                </a>{" "}
                (Author must have an account in Microsoft CMT)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
               <span>
                Email the Author Information Form to{" "}
                <a href={`mailto:${emailMethod?.email_address || config.submission_email}`}
                   className="text-primary hover:text-accent underline font-medium">
                   {emailMethod?.email_address || config.submission_email}
                </a>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Maximum length of Extended Abstract is <strong>4 pages</strong> (one column)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionRequirements;

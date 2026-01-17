import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CameraReady = () => {
  const { data, isLoading, isError } = useAuthorInstructions();

  if (isLoading) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/10">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertDescription>Failed to load camera ready information.</AlertDescription>
      </Alert>
    );
  }

  if (!data.config.camera_ready_required) {
    return null;
  }

  return (
  <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/10">
    <CardHeader>
      <CardTitle className="text-xl">
        Camera Ready Submission (For Accepted Abstracts)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Use the official "Camera Ready Submission" template from Downloads for your final submission. Ensure that fonts, spacing, and affiliations follow the RISTCON 2026 standards. Refer to the main document for detailed formatting instructions. Submissions not adhering to these guidelines will be returned.
      </p>
    </CardContent>
  </Card>
  );
};

export default CameraReady;

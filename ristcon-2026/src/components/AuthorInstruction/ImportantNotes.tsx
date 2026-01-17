import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ImportantNotes = () => {
  const { data, isLoading, isError } = useAuthorInstructions();

  if (isLoading) {
    return (
      <Card className="mb-8 bg-muted/30">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertDescription>Failed to load important notes.</AlertDescription>
      </Alert>
    );
  }

  // Split special_instructions by periods to create list items
  const instructions = data.config.special_instructions
    .split('. ')
    .filter(item => item.trim())
    .map(item => item.trim() + (item.endsWith('.') ? '' : '.'));

  return (
  <Card className="mb-8 bg-muted/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        <AlertCircle className="w-5 h-5 text-destructive" />
        Important Notes
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {instructions.map((note, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-primary font-bold mt-1">•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
  );
};

export default ImportantNotes;

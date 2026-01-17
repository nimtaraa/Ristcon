/**
 * ErrorState Component
 * Reusable error display component
 */

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  /**
   * Error message to display
   */
  message?: string;
  /**
   * Title for the error
   */
  title?: string;
  /**
   * Whether to show in a section container
   */
  inSection?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

export function ErrorState({
  message = "Failed to load data. Please try again later.",
  title = "Error",
  inSection = false,
  className = "",
}: ErrorStateProps) {
  const content = (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  if (inSection) {
    return (
      <section className="pt-12 bg-gradient-section">
        <div className="container mx-auto px-4 text-center py-8">
          {content}
        </div>
      </section>
    );
  }

  return <div className="container mx-auto px-4 py-8">{content}</div>;
}

/**
 * Inline Error State (for smaller sections)
 */
export function InlineErrorState({ 
  message = "Failed to load data.", 
  className = "" 
}: { 
  message?: string; 
  className?: string 
}) {
  return (
    <div className={`text-center py-4 ${className}`}>
      <p className="text-destructive flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {message}
      </p>
    </div>
  );
}

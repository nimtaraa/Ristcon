/**
 * LoadingState Component
 * Reusable loading skeleton component
 */

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  /**
   * Number of skeleton items to display
   */
  count?: number;
  /**
   * Height of each skeleton item (Tailwind class)
   */
  itemHeight?: string;
  /**
   * Show header skeletons
   */
  showHeader?: boolean;
  /**
   * Container class name
   */
  className?: string;
}

export function LoadingState({
  count = 4,
  itemHeight = "h-32",
  showHeader = true,
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {showHeader && (
        <div className="text-center mb-6">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      )}
      <div className="max-w-4xl mx-auto space-y-8">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className={`${itemHeight} w-full`} />
        ))}
      </div>
    </div>
  );
}

/**
 * Inline Loading State (for smaller sections)
 */
export function InlineLoadingState({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

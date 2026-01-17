import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchAreas } from "@/hooks/useResearchAreas";

const KeyAreasInteractive: React.FC = () => {
  const { data: areasResponse, isLoading, isError } = useResearchAreas();
  
  // Transform API data to the format expected by the component
  const data = areasResponse?.data?.reduce((acc, category) => {
    acc[category.title] = category.fields;
    return acc;
  }, {} as Record<string, string[]>) || {};

  const renderTopicsTwoColSplit = (topics: string[]) => {
    const firstCol = topics.slice(0, Math.ceil(topics.length / 2));
    const secondCol = topics.slice(Math.ceil(topics.length / 2));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {[firstCol, secondCol].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((topic, index) => (
              <div
                key={topic}
                className={`px-3 py-2 text-sm rounded-md ${
                  index % 2 === 0 ? "bg-indigo-50" : "bg-white"
                }`}
              >
                {topic}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryCard = (category: string) => {
    return (
      <div
        key={category}
        className="rounded-xl shadow-md bg-white p-4 sm:p-5 w-full"
      >
        <h3 className="font-bold text-lg sm:text-xl mb-3">{category}</h3>
        {renderTopicsTwoColSplit(data[category])}
      </div>
    );
  };

  if (isError) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 text-center py-8">
        <p className="text-destructive">Failed to load research areas. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <Skeleton className="h-6 w-3/4 mb-6 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl shadow-md bg-white p-4 sm:p-5">
              <Skeleton className="h-7 w-2/3 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-8 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
      <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed text-center sm:text-left">
        RISTCON 2026 invites researchers to submit their original contributions
        on the following areas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(data).length > 0 ? (
          Object.keys(data).map((category) => renderCategoryCard(category))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No research areas available.</p>
        )}
      </div>
    </div>
  );
};

export default KeyAreasInteractive;

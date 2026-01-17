import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeakers } from "@/hooks/useSpeakers";

const SpeakersSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: speakersResponse, isLoading, isError } = useSpeakers();
  
  const speakers = speakersResponse?.data || [];

  if (isError) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Failed to load speakers. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="px-6 md:px-12 lg:px-24 mx-auto">

        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Leading Voices: Our Keynote Speakers
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full max-w-[260px]">
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg h-[500px] flex flex-col">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {speakers.map((speaker, index) => {
            const isExpanded = expanded === index;

            return (
              <div
                key={index}
                className="group animate-fade-in w-full max-w-[260px]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[500px] flex flex-col">

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow relative">

                    <h3 className="text-lg font-bold text-card-foreground mb-2">
                      {speaker.name}
                    </h3>

                    <div className="relative flex-grow">
                      <p
                        className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${
                          isExpanded ? "max-h-none" : "max-h-20 overflow-hidden"
                        }`}
                      >
                        {speaker.expertise}
                        <br />
                        {speaker.affiliation}
                      </p>

                      {/* Fade-out overlay */}
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                      )}
                    </div>

                    {/* See more */}
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : index)
                      }
                      className="text-teal mt-3 text-sm font-medium hover:underline"
                    >
                      {isExpanded ? "See Less" : "See More"}
                    </button>

                    
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
};

export default SpeakersSection;

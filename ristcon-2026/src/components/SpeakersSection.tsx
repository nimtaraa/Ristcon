import { SpeakerCard } from "@/components/SpeakerCard";
import SpeakersSection from "@/components/SpeakersSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeakers } from "@/hooks/useSpeakers";

const Index = () => {
  const { data: speakersResponse, isLoading, isError } = useSpeakers();
  const speakers = speakersResponse?.data || [];

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load speakers. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="relative pt-16 pb-2 bg-gradient-to-b from-background to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-12 w-96 mx-auto" />
            </div>
          </div>
        </header>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative pt-16 pb-2 bg-gradient-to-b from-background to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Speakers
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Event{" "}
              <span className="bg-gradient-to-r from-blue-950 to-blue-500 bg-clip-text text-transparent">
                 Speakers
              </span>
            </h2>
            
          </div>
        </div>
      </header>

      {/* Speaker Cards */}
      <section className="py-2 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={index} {...speaker} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

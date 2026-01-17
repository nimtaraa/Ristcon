import { useRef, useEffect } from "react";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { events } from "@/lib/events_data";
import SectionHeader from "@/components/SectionHeader";

const PastEvents = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          sectionRef.current.classList.add("opacity-100", "translate-y-0");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className="min-h-screen bg-muted/30 px-2 py-28 "
    >
      <div className="container mx-auto max-w-7xl">
        
         <SectionHeader title="Past Events & Conferences"/>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />

          <div>
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8`}
              >
                {/* Year badge */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-primary text-primary-foreground items-center justify-center text-2xl font-bold shadow-lg z-10 border-4 border-background">
                  {event.year}
                </div>

                {/* Spacer for timeline */}
                <div className="hidden md:block w-1/2" />

                {/* Event card */}
                <Card className="w-full md:w-1/2 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-4 space-y-2 mx-3">
                    <div className="flex items-start justify-between">
                      <div className="md:hidden inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                        {event.year}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      {event.title}
                    </h3>

                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>

                    {event.theme && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-foreground">
                          <span className="text-primary font-semibold">Theme:</span> {event.theme}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:text-accent transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                        Visit Conference Website
                      </a>
                      
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;

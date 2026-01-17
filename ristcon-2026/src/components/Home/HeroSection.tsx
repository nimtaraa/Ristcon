import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PulsingCircles from "./PulsingCircles";
import { useConference } from "@/hooks/useConference";
import { calculateCountdown } from "@/lib/api/transformers";

const HeroSection = () => {
  const { data: conference, isLoading, isError } = useConference();
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!conference?.conference_date) return;

    const updateCountdown = () => {
      const countdown = calculateCountdown(conference.conference_date);
      setTimeLeft(countdown);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [conference]);

  return (
<section className="relative bg-primary text-primary-foreground pt-4 pb-20 md:pt-10 md:pb-32 overflow-hidden">
  <div className="container mx-auto px-4">
    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-teal/30 bg-teal/5 backdrop-blur-sm">
      
      {/* Medal */}
      <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center border border-teal/40">
        {isLoading ? (
          <Skeleton className="w-6 h-6 rounded-full" />
        ) : (
          <span className="text-lg font-bold text-teal">{conference?.edition_number || 13}</span>
        )}
      </div>

      {/* Title */}
      {isLoading ? (
        <Skeleton className="h-4 w-64" />
      ) : (
        <span className="text-sm md:text-base font-medium text-primary-foreground/90">
          Ruhuna International Science & Technology Conference {conference?.year}
        </span>
      )}
    </div>
  </div>

  <div className="container mx-auto px-4">

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </>
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {conference?.theme || "Bridging Frontiers in Science and Innovation"}
              </h1>
            )}

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="font-serif text-teal text-base sm:text-sm md:text-md text-primary-foreground/80 max-w-xl leading-relaxed text-justify sm:text-left">
                {conference?.description || `RISTCON ${conference?.year || 2026} is organized by the Faculty of Science, University of Ruhuna, Sri Lanka. This conference aims to provide the premier multidisciplinary forum for leading academics, researchers and research students to present and discuss their innovations, concerns, challenges and solutions in Science and Technology.`}
              </p>
            )}

            {/* Countdown Timer */}
            <div className="relative inline-block">
              <div className="relative bg-gradient-to-br from-blue-950/30 via-blue-900/20 to-transparent backdrop-blur-lg rounded-xl p-4 md:p-5 border border-white/10 shadow-xl group hover:border-teal/30 transition-all duration-500">

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal/0 via-teal/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
                    </span>
                    <p className="text-[10px] md:text-xs uppercase tracking-wider text-teal/90 font-semibold">
                      Event Countdown
                    </p>
                  </div>

                  {/* Time Units */}
                  <div className="flex items-center gap-2 md:gap-3">
                    {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
                      <div className="flex items-center" key={unit}>
                        <div className="text-center group/item">
                          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-white/10 transition-all duration-300 group-hover/item:scale-105 group-hover/item:border-teal/40 group-hover:item:bg-white/10 group-hover:item:shadow-lg group-hover:item:shadow-teal/20">
                            <div className="text-xl md:text-3xl font-bold bg-gradient-to-br from-white via-white to-teal/90 bg-clip-text text-transparent tabular-nums">
                              {String(timeLeft[unit]).padStart(2, "0")}
                            </div>
                            <div className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-wider mt-0.5 font-medium">
                              {unit === "minutes" ? "Mins" : unit === "seconds" ? "Secs" : unit[0].toUpperCase() + unit.slice(1)}
                            </div>
                          </div>
                        </div>

                        {/* Separator */}
                        {idx < 3 && (
                          <div className="text-teal/50 text-lg md:text-2xl font-bold pb-3">
                            :
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
<br/>
            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-8 group"
            >
              CONNECT WITH US TODAY
            </Button>
          </div>
                    
          <PulsingCircles outerColor="#373e3d" innerColor="#41688c" numCircles={7} />


        </div>
      </div>
    </section>
  );
};

export default HeroSection;

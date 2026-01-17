import heroImage from "@/assets/hero-speaker.jpg";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const targetDate = new Date("2026-01-21T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="relative min-h-screen bg-background overflow-hidden ">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-600/35 to-blue-950/70" />

      </div>
      {/* Main Hero Content */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="animate-fade-in">
            <h1 className="font-display text-foreground mt-10 mb-6">
              <span className="block text-white text-4xl md:text-6xl mb-2">Igniting  brighter </span>
              <span className="block text-accent text-5xl md:text-7xl font-bold italic mb-2">the spark  </span>
              <span className="block text-white text-4xl md:text-6xl">of discovery </span>
              <span className="block text-white text-4xl md:text-6xl">to shape futures.</span>
            </h1>

            <p className="font-body text-base md:text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed">
              RISTCON delivers motivational, high-energy keynotes and seminars that inspire positive change and transform lives. With decades of experience empowering global audiences, we help individuals and organizations unlock their potential, build resilience, and embrace their mission—becoming catalysts for meaningful innovation and progress.</p>

          </div>
         </div>         
      </div>

   
      <div className="absolute bottom-[1px] left-1/4 -translate-x-1/2 z-20 ">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto mb-8">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" },
              ].map((item, index) => (
                <div key={index} className="bg-background/20 backdrop-blur-sm p-2 rounded-xl">
                  <div className="text-3xl text-white md:text-4xl font-bold">{item.value}</div>
                  <div className="text-xs text-white md:text-sm opacity-90">{item.label}</div>
                </div>
              ))}
            </div>
      </div>

       <div className="absolute bottom-0 left-0 w-full z-10">       
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>

    </section>
  );
};

export default HeroSection;

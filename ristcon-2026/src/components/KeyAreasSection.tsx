import { MapPin, Calendar } from "lucide-react";
import meeting1 from "@/assets/event-meeting-1.jpg";
import meeting2 from "@/assets/event-meeting-2.jpg";
import meeting3 from "@/assets/event-meeting-3.jpg";
import { Card, CardContent } from "./ui/card";

const KeyAreasSection = () => {
  return (
   <section className="relative pt-12 pb-12 mr-48  bg-card overflow-hidden">
  {/* Watermark "ABOUT" background */}
  <div className="absolute inset-0 flex items-start justify-start pointer-events-none">
    <div className="text-[10rem] md:text-[12rem] font-extrabold text-gray-400/10 select-none leading-none">
      ABOUT
    </div>
  </div>

  <div className="container ml-48 mt-10 mx-auto px-4 relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Text Content */}
      <div className="animate-fade-in">
        <h3 className="font-display text-2xl md:text-2xl lg:text-4xl font-bold text-blue-950 mb-6">
          WELCOME TO THE GREATEST
          <br />
          RESEARCH <span className="text-yellow-600">CONFERENCE</span>
        </h3>

        <p className="font-body text-base text-muted-foreground mb-6 leading-relaxed">
          There is a group of innovative, motivated people who gather for this amazing experience — attendees have described it as "unparalleled" and "really special to be a part of."
        </p>

        <p className="font-body text-base text-muted-foreground mb-8 leading-relaxed">
          RISTCON at the University of Ruhuna offers a unique platform where collaboration, inspiration, and groundbreaking research come together to advance science and technology for a better future.
        </p>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* WHERE */}
          <Card className="bg-gradient-card border-primary/10 shadow-card">
            <CardContent className="p-2">
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    WHERE
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    University of Ruhuna
                    <br />
                    Faculty of Science,
                    <br />
                    Matara, Sri Lanka
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WHEN */}
          <Card className="bg-gradient-card border-primary/10 shadow-card">
            <CardContent className="p-2">
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    WHEN
                  </h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Wednesday To Thursday
                    <br />
                    Jan: 25–26, 2026
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Images */}
      <div className="relative animate-slide-up">
        <div className="grid grid-cols-2 gap-[6px]">
          <div className="flex flex-col gap-3">
            <img
              src={meeting2}
              alt="Team collaboration"
              className="w-[360px] h-[180px] object-cover rounded-2xl shadow-card"
            />
            <img
              src={meeting3}
              alt="Workshop session"
              className="w-[440px] h-[220px] object-cover rounded-2xl shadow-card self-end"
            />
          </div>

          <div className="flex items-center justify-center">
            <img
              src={meeting1}
              alt="Conference meeting"
              className="w-full h-[380px] object-cover rounded-2xl shadow-card"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default KeyAreasSection;

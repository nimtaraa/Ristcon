import { Play } from "lucide-react";
import audienceImg from "@/assets/audience-seminar.jpg";

const VideoSection = () => {
  return (
    <section className="py-20 bg-muted relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute left-0 top-1/4 text-9xl font-bold text-border/30 select-none hidden lg:block">
        changing
      </div>
      <div className="absolute right-0 bottom-1/4 text-9xl font-bold text-border/30 select-none hidden lg:block">
        lives
      </div>
      
      <div className="absolute left-12 top-12 w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute right-12 bottom-12 w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
            <img
              src={audienceImg}
              alt="Audience at motivational seminar"
              className="w-full h-auto object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent flex items-center justify-center">
              <div className="text-center text-primary-foreground p-8">
                <h3 className="text-4xl md:text-6xl font-bold mb-4">
                  Unlocking
                </h3>
                <p className="text-5xl md:text-7xl italic font-serif text-teal mb-4">
                  Potential
                </p>
                <p className="text-4xl md:text-6xl font-bold mb-8">
                  and Changing <span className="italic font-serif text-teal">Lives</span>
                </p>
                
                {/* Play Button */}
                <button className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 mx-auto group-hover:bg-teal">
                  <Play className="w-10 h-10 text-secondary-foreground fill-current ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Podcast Platforms */}
          <div className="mt-16 text-center animate-fade-in">
            <p className="text-sm font-semibold text-muted-foreground mb-6 tracking-wide">
              MOVING AUDIENCES AND CHANGING LIVES AROUND THE GLOBE INCLUDING:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {["Apple Podcasts", "Spotify", "Google Podcasts", "Stitcher", "iHeartRadio"].map(
                (platform, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <span className="text-sm font-medium text-card-foreground">{platform}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
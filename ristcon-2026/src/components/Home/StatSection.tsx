import { Award, BookOpen, Users, TrendingUp } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Award,
      title: "Internationally Acclaimed Speaker, Podcast Host & Executive Coach",
      description: "Award-winning professional speaker",
    },
    {
      icon: BookOpen,
      title: "Recognized Author and Expert in Peak Performance, Education & Relationships",
      description: "Published thought leader",
    },
    {
      icon: Users,
      title: "500,000+ Attendees Inspired at Live Seminars Around the Globe",
      description: "Massive global impact",
    },
    {
      icon: TrendingUp,
      title: "Leading Provider of Values-Based Wellbeing & Mindfulness Resources",
      description: "Trusted wellness expert",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-12 h-12 text-teal mb-4" />
              <h3 className="text-sm font-semibold text-card-foreground mb-2 leading-tight">
                {stat.title}
              </h3>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
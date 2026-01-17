import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useImportantDates } from '@/hooks/useImportantDates';

const TimelineSection = () => {
  const { data: datesResponse, isLoading, isError } = useImportantDates();
  
  const timeline = (datesResponse?.data || []).map((date, index) => ({
    title: date.title,
    date: date.date,
    description: date.description || `Important milestone for ${date.title.toLowerCase()}`,
    icon: date.icon,
    status: date.status,
    branch: index % 2 === 0 ? "right" : "left"
  }));

  if (isError) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Failed to load important dates. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-950 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-800 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
         
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Important <span className="text-primary">Dates</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mark your calendar with these crucial milestones for our upcoming conference
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Central Trunk */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-blue-950 to-primary transform -translate-x-1/2"></div>

            {/* Tree Root */}
            <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-950 rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>



            {/* Timeline Items */}
            <div className="space-y-12 pt-12">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
                const isRight = item.branch === "right";
                
                return (
                  <div 
                    key={item.title}
                    className="relative opacity-0 animate-slide-in"
                    style={{ 
                      animationDelay: `${index * 0.3}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {/* Branch Line */}
                    <div className={`absolute top-1/2 w-16 h-0.5 bg-gradient-to-r hidden md:block ${
                      isRight 
                        ? 'left-1/2 from-blue-900 to-transparent' 
                        : 'right-1/2 from-transparent to-blue-900'
                    }`}></div>

                    {/* Node Circle */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 hidden md:block ${
                      isRight ? 'left-1/2 -translate-x-1/2' : 'right-1/2 translate-x-1/2'
                    }`}>
                      <div className="relative">
                        <div className="w-12 h-12 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg z-10 relative">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 w-12 h-12 bg-primary rounded-full animate-ping opacity-20"></div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`flex items-center ${
                      isRight ? 'md:justify-start md:pl-24' : 'md:justify-end md:pr-24'
                    }`}>
                      <Card className="group w-full md:w-96 bg-white border-2 border-blue-100 hover:border-primary transition-all duration-500  hover:shadow-blue-200 hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-6">
                          {/* Mobile Icon */}
                          <div className="md:hidden mb-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-900 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-primary group-hover:text-blue-950 transition-colors">
                              {item.title}
                            </h3>
                            <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-primary font-semibold">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">{item.date}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">{item.status}</span>
                            </div>
                          </div>

                          {/* Decorative Corner */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-lg"></div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tree Ending */}
            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 hidden md:block">
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-blue-950 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer">
              <p className="text-white font-semibold text-lg flex items-center">
                Don't Miss Out! Start Planning Today
              </p>
            </div>
          </div>
        </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default TimelineSection;
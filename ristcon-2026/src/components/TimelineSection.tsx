import { Card, CardContent } from '@/components/ui/card';
import { useImportantDates } from '@/hooks/useImportantDates';
import { LoadingState, ErrorState } from '@/components/shared';
import { Calendar } from 'lucide-react';

const TimelineSection = () => {
  const { data: datesResponse, isLoading, isError } = useImportantDates();
  
  const timeline = (datesResponse?.data || []).map(date => ({
    title: date.title,
    date: date.date,
    description: date.description || `Important milestone for ${date.title.toLowerCase()}`,
    icon: date.icon,
    status: date.status,
    color: date.status === 'completed' ? 'text-green-600' : 'text-orange-600'
  }));

  if (isError) {
    return <ErrorState message="Failed to load important dates. Please try again later." inSection />;
  }

  if (isLoading) {
    return (
      <section className="pt-12 bg-gradient-section">
        <LoadingState count={4} itemHeight="h-32" />
      </section>
    );
  }

  return (
    <section className="pt-12 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Important <span className="bg-gradient-to-r from-blue-950 to-blue-500 bg-clip-text text-transparent">Dates</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Mark your calendar with these crucial milestones
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary md:transform md:-translate-x-0.5"></div>

            {/* Timeline Items */}
            <div className="space-y-2">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={item.title}
                    className={`relative flex items-center animate-fade-in ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-background border-4 border-primary rounded-full flex items-center justify-center transform md:-translate-x-1/2 z-10">
                      <IconComponent className="h-4 w-4 text-blue-950" />
                    </div>

                    {/* Content Card */}
                    <div className={`ml-16 md:ml-0 flex-1 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                      <Card className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border border-primary/10">
                        <CardContent className="p-4">
                          <div className={`flex items-start space-x-4 ${isEven ? '' : 'md:flex-row-reverse md:space-x-reverse'}`}>
                            <div className={`flex-1 `}>
                              <h3 className="text-xl font-semibold text-blue-950 group-hover:transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground mb-2 leading-relaxed">
                                {item.description}
                              </p>
                              <p className="text-green-900 font-medium mb-2 flex items-center">
                                <Calendar className={`h-4 w-4 mr-2 ${isEven ? '' : 'md:ml-2 md:mr-0 md:order-2'}`} />
                                {item.date}
                              </p>
                              
                            </div>
                          </div>

                          {/* Progress Indicator */}
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className={`h-2 w-2 rounded-full ${item.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                              <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Spacer for even layout */}
                    <div className="hidden md:block flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-14 animate-fade-in">
           <h3 className="text-lg font-semibold text-primary mb-2">Don't Miss Out!</h3>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
import { useState } from 'react';
import { MapPin, Navigation, Download, Clock, Plane, Car, Train, ChevronDown, Calendar, Building, Coffee, Wifi, ParkingCircle, Hotel } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from '@/hooks/useLocation';

const LocationSection = () => {
  const { data: locationData, isLoading, isError } = useLocation();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  const venueFeatures = [
    { 
      icon: Building, 
      title: "Conference Facilities",
      text: "Modern conference facilities with state-of-the-art AV equipment",
      details: "Multiple halls with capacities ranging from 50-500 attendees, equipped with HD projectors, sound systems, and recording facilities."
    },
    { 
      icon: ParkingCircle, 
      title: "Parking",
      text: "Ample parking space for attendees",
      details: "500+ parking slots available with separate areas for cars, buses, and designated disabled parking zones."
    },
    { 
      icon: Coffee, 
      title: "Dining",
      text: "On-campus dining options and refreshment areas",
      details: "Multiple cafeterias and food courts serving Sri Lankan and international cuisine. Coffee bars and snack stations throughout the venue."
    },
    { 
      icon: Wifi, 
      title: "WiFi",
      text: "High-speed WiFi throughout the campus",
      details: "Dedicated conference WiFi network with 1Gbps connectivity. Separate networks for attendees and presenters."
    },
    { 
      icon: Hotel, 
      title: "Accommodation",
      text: "Nearby accommodation options",
      details: "Partner hotels within 2km radius offering special conference rates. Guest house facilities available on campus."
    }
  ];

  const campusHighlights = [
    { 
      id: "science",
      title: "Science Faculty", 
      subtitle: "Main Venue",
      description: "State-of-the-art auditoriums and breakout rooms",
      capacity: "500+ attendees"
    },
    { 
      id: "library",
      title: "Library", 
      subtitle: "Study Area",
      description: "Quiet zones for networking and discussions",
      capacity: "200 seats"
    },
    { 
      id: "cafeteria",
      title: "Cafeteria", 
      subtitle: "Dining",
      description: "Multiple dining options and refreshment zones",
      capacity: "300 seats"
    },
    { 
      id: "parking",
      title: "Parking", 
      subtitle: "Vehicle Access",
      description: "Secure parking with 24/7 security",
      capacity: "500+ vehicles"
    }
  ];

  const travelOptions = [
    {
      icon: Plane,
      title: "By Air",
      description: "Nearest airport: Mattala Rajapaksa International Airport (45 km)",
      subDescription: "Alternative: Bandaranaike International Airport (160 km)",
      duration: "45 min drive",
      cost: "~$30 by taxi"
    },
    {
      icon: Car,
      title: "By Road",
      description: "From Colombo: 2.5 hours via Southern Expressway",
      subDescription: "From Galle: 45 minutes via Matara Road",
      duration: "2.5 hours",
      cost: "Expressway toll: ~$5"
    },
    {
      icon: Train,
      title: "By Train",
      description: "Matara Railway Station (5 km from campus)",
      subDescription: "Regular services from Colombo Fort",
      duration: "3 hours",
      cost: "~$3 per person"
    }
  ];

  if (isError) {
    return (
      <section className="pt-12 bg-background">
        <div className="container mx-auto px-4 text-center py-8">
          <p className="text-destructive">Failed to load location information. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="pt-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Event <span className="bg-gradient-to-r from-blue-950 to-blue-500 bg-clip-text text-transparent">Location</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore venue details and travel information
          </p>
        </div>

        <div className="max-w-7xl mx-auto animate-fade-in space-y-14">
          {/* Location Section */}
          <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Venue Card with Map */}
               <Card className="bg-gradient-card border-primary/10 shadow-card">
                  <CardContent className="p-0">
                    <div className="relative h-[220px] bg-gradient-section flex items-center justify-center cursor-pointer group">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">{locationData?.venue_name || 'University of Ruhuna'}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {locationData?.address || 'Faculty of Science, Wellamadama'}<br />
                          {locationData?.city && locationData?.postal_code ? `${locationData.city} ${locationData.postal_code}, ${locationData.country || 'Sri Lanka'}` : 'Matara 81000, Sri Lanka'}
                        </p>
                        <Button 
                          variant="hero" 
                          size="sm"
                          onClick={() => locationData?.google_maps_url && window.open(locationData.google_maps_url, '_blank')}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                      
                    </div>
                    <div className="flex justify-center py-3">
                          <Button variant="outline" className="w-64" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Campus Map
                          </Button>
                    </div>
                  </CardContent>
                </Card>


                {/* Interactive Features */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">Venue Features</h3>
                  {venueFeatures.map((feature, index) => (
                    <Collapsible
                      key={index}
                      open={expandedFeature === index}
                      onOpenChange={() => setExpandedFeature(expandedFeature === index ? null : index)}
                    >
                      
                  
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                  <h4 className="text-blue-950">{feature.text}</h4>
                                  
                                </div>
                              </div>                             
                            </div>
                       
                    </Collapsible>
                  ))}
                </div>
              </div>

              {/* Interactive Campus Highlights */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Campus Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {campusHighlights.map((item) => (
                    <Card 
                      key={item.id}
                      onClick={() => setSelectedCampus(selectedCampus === item.id ? null : item.id)}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCampus === item.id 
                          ? 'bg-gradient-hero border-primary shadow-glow' 
                          : 'bg-gradient-card border-primary/10 '
                      }`}
                    >
                      <CardContent className="p-2">
                        <h4 className={`font-semibold text-lg mb-1 ${
                          selectedCampus === item.id ? 'text-primary-foreground' : 'text-foreground'
                        }`}>
                          {item.title}
                        </h4>
                        <p className={`text-sm mb-3 ${
                          selectedCampus === item.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {item.subtitle}
                        </p>
                        {selectedCampus === item.id && (
                          <div className="mt-4 pt-4 border-t border-primary-foreground/20 space-y-2 animate-fade-in">
                            <p className="text-sm text-primary-foreground/90">{item.description}</p>
                            <p className="text-xs text-primary-foreground/70">Capacity: {item.capacity}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
          </div>
          </div>

          {/* Travel Section */}
          <div className='mt-12 mb-10'>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                {travelOptions.map((option, index) => (
                  <Card 
                    key={index}
                    className="bg-gradient-card border-primary/10 shadow-card"
                  >
                    <CardContent className="p-2 text-center">
                      <div className="inline-flex p-2 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                        <option.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{option.title}</h3>
                      <p className="text-muted-foreground mb-2 leading-relaxed">
                        {option.description}
                      </p>
                      <p className="text-sm text-muted-foreground/80 mb-2">
                        {option.subDescription}
                      </p>
                     
                    </CardContent>
                  </Card>
                ))}
              </div>

              
            </div>
          </div>
        </div>
     
    </section>
  );
};

export default LocationSection;

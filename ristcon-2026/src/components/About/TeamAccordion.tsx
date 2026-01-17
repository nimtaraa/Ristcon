import React from "react";
import { Users, Award, BookOpen, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommittees, useContacts } from "@/hooks/useCommittees";


const TeamAccordion: React.FC = () => {
  const { data: committeesData, isLoading: committeesLoading, isError: committeesError } = useCommittees();
  const { data: contactsData, isLoading: contactsLoading, isError: contactsError } = useContacts();
  
  const isLoading = committeesLoading || contactsLoading;
  const isError = committeesError || contactsError;

  const tabIcons: Record<string, any> = {
    "Advisory Board": Award,
    "Editorial Board": BookOpen,
    "Committee Members": Users,
    "Contact People": Mail,
  };

  if (isError) {
    return (
      <section className="py-4 bg-gray-50 mt-8">
        <div className="mx-auto w-full max-w-[1400px] px-6 text-center">
          <p className="text-destructive">Failed to load team information. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-4 bg-gray-50 mt-8">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 md:px-12 lg:px-16">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Ensure all values are arrays
  const teamDetails: Record<string, any[]> = {
    ...(committeesData?.data || {}),
    "Contact People": contactsData?.data || []
  };

  return (
    <section className="py-4 bg-gray-50 mt-8">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            RISTCON <span className="text-gray-700">Team</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet the organizing members of RISTCON 2026
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="Advisory Board" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-white border border-gray-300 rounded-md shadow-sm"> 
              {Object.entries(tabIcons).map(([key, Icon]) => ( 
                <TabsTrigger key={key} value={key} 
                  className="flex items-center space-x-2 justify-center text-gray-700 hover:text-blue-900 data-[state=active]:bg-blue-100 data-[state=active]: text-blue-900 rounded-md transition-colors" > 
                  <Icon className="h-4 w-4" /> 
                  <span className="hidden sm:inline">{key}</span> 
                </TabsTrigger> 
              ))} 
              </TabsList>

            {/* Tabs Content */}
            {Object.entries(teamDetails).map(([category, members]) => (
              <TabsContent key={category} value={category}>
                {category !== "Contact People" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg-gris-cols-2 gap-6">
                    {Array.isArray(members) && members.map((member, index) => (
                      <Card
                        key={index}
                        className="w-full"
                      style={{ animationDelay: `${index * 0.1}s` }}

                      >
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {member.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{member.department}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Array.isArray(members) && members.map((person, index) => (
                      <Card
                        key={index}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-blue-900 mb-2">
                            {person.name}
                          </h3>
                          <p className="text-gray-700 font-medium mb-1">{person.position}</p>
                          <p className="text-gray-500 text-sm mb-4">{person.department}</p>

                          <div className="space-y-2 text-sm">
                            {person.email && (
                              <div className="flex items-center space-x-2 flex-wrap">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <a
                                  href={`mailto:${person.email}`}
                                  className="text-gray-600 hover:text-blue-700 transition-colors break-all"
                                >
                                  {person.email}
                                </a>
                              </div>
                            )}
                            {person.mobile && (
                              <div className="flex items-center space-x-2">
                                <span>📱</span>
                                <span className="text-gray-600">{person.mobile}</span>
                              </div>
                            )}
                            {person.phone && (
                              <div className="flex items-center space-x-2">
                                <span>📞</span>
                                <span className="text-gray-600">{person.phone}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {category === "Contact People" && (
                  <Card className="mt-8 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-primary mb-4">
                        General Inquiries
                      </h3>
                      <p className="text-gray-600 mb-4">
                        For any general inquiries about RISTCON 2026, please reach out to us.
                      </p>
                      <Button className="bg-primary hover:bg-blue-950 text-white transition-all">
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TeamAccordion;

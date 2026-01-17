import { Users, Award, BookOpen, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommittees, useContacts } from '@/hooks/useCommittees';

const TeamSection = () => {
  const { data: committeesData, isLoading: committeesLoading, isError: committeesError } = useCommittees();
  const { data: contactsData, isLoading: contactsLoading, isError: contactsError } = useContacts();
  
  const isLoading = committeesLoading || contactsLoading;
  const isError = committeesError || contactsError;

  // Transform API data to match component structure
  const teamData = {
    advisory: committeesData?.data?.["Advisory Board"] || [],
    editorial: committeesData?.data?.["Editorial Board"] || [],
    committee: committeesData?.data?.["Committee Members"] || [],
    contact: contactsData?.data || []
  };

  if (isError) {
    return (
      <section className="py-20 bg-gradient-section">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Failed to load team information. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
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

  const tabIcons = {
    advisory: Award,
    editorial: BookOpen,
    committee: Users,
    contact: Mail
  };

  return (
    <section className="pt-4 pb-12 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            RISTCON <span className="bg-gradient-to-r from-blue-950 to-blue-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated professionals organizing RISTCON 2026
          </p>
        </div>

        {/* Team Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="advisory" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-background/50 border border-primary/20">
              {Object.entries(tabIcons).map(([key, IconComponent]) => (
                <TabsTrigger 
                  key={key}
                  value={key} 
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline capitalize">
                    {key === 'advisory' ? 'Advisory Board' : 
                     key === 'editorial' ? 'Editorial Board' :
                     key === 'committee' ? 'Committee' : 'Contact'}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Advisory Board */}
            <TabsContent value="advisory" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamData.advisory.map((member, index) => (
                  <Card 
                    key={member.name}
                    className="group bg-gradient-card border border-primary/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-medium mb-1">{member.position}</p>
                      <p className="text-muted-foreground text-sm">{member.institution}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Editorial Board */}
            <TabsContent value="editorial" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamData.editorial.map((member, index) => (
                  <Card 
                    key={member.name}
                    className="group bg-gradient-card border border-primary/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-medium mb-1">{member.position}</p>
                      <p className="text-muted-foreground text-sm">{member.institution}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Committee Members */}
            <TabsContent value="committee" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamData.committee.map((member, index) => (
                  <Card 
                    key={member.name}
                    className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border border-primary/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-medium mb-1">{member.position}</p>
                      <p className="text-muted-foreground text-sm">{member.institution}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Contact Persons */}
            <TabsContent value="contact" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teamData.contact.map((contact, index) => (
                  <Card 
                    key={contact.name}
                    className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border border-primary/10"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {contact.name}
                      </h3>
                      <p className="text-secondary font-medium mb-2">{contact.position}</p>
                      <p className="text-muted-foreground text-sm mb-4">{contact.institution}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-primary" />
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-muted-foreground hover:text-primary transition-colors duration-200"
                          >
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="h-4 w-4 text-primary">📞</span>
                            <span className="text-muted-foreground">{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* General Contact Card */}
              <Card className="mt-8 bg-primary/5 border border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-primary mb-4">General Inquiries</h3>
                  <p className="text-muted-foreground mb-4">
                    For general questions about RISTCON 2026, please feel free to reach out to us.
                  </p>
                  <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
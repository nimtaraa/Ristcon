import {
  FileText,
  Download,
  FileImage,
  FileCheck,
  Calendar,
  Award,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/useDocuments";
import { useConference } from "@/hooks/useConference";

const DownloadsSection = () => {
  const { data: documentsData, isLoading: docsLoading, isError: docsError } = useDocuments();
  const { data: conference, isLoading: confLoading } = useConference();
  
  const isLoading = docsLoading || confLoading;
  const isError = docsError;

  const downloads = documentsData?.data || [];
  const conferenceDates = conference?.conference_date 
    ? [
        { day: "Day 1", date: new Date(conference.conference_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { day: "Day 2", date: new Date(new Date(conference.conference_date).getTime() + 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
      ]
    : [];

  if (isError) {
    return (
      <section className="relative py-14 px-4 sm:px-6 lg:px-16 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-destructive">Failed to load downloads. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="relative py-14 px-4 sm:px-6 lg:px-16 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-16 bg-background overflow-hidden">
      {/* --- Background Decoration (Mobile Safe) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-0 text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black text-primary/5 select-none -rotate-6">
          CONFERENCE
        </div>

        <div className="absolute bottom-10 right-0 text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[8rem] font-black text-accent/5 select-none rotate-6">
          2026
        </div>

        <div className="absolute top-32 right-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-10 w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-2xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-5">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            Resources & <span className="text-primary">Downloads</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Conference Dates Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            <CardContent className="p-6 relative">
              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Conference Dates</h3>
                  <p className="text-sm text-muted-foreground">Mark your calendar</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {conferenceDates.map((item, index) => (
                  <div
                    key={index}
                    className="relative p-4 rounded-xl bg-gradient-to-r from-background to-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-primary mb-1">
                          {item.day}
                        </p>
                        <p className="text-xl font-bold">{item.date}</p>
                      </div>
                      <Award className="h-6 w-6 text-primary/40" />
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="w-full items-center justify-center gap-2 text-center whitespace-normal px-4 py-3"
                asChild
              >
                <a 
                  href={downloads.find(d => d.category === 'programme')?.downloadUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">Download Complete Program</span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Downloads Section */}
          <div className="space-y-4 w-full">
            {downloads
              .filter(doc => doc.isAvailable)
              .map((doc) => {
                // Map document category to icon
                const getIcon = (category: string) => {
                  switch (category) {
                    case 'abstract_template':
                      return FileText;
                    case 'author_form':
                      return FileCheck;
                    case 'registration_form':
                      return FileImage;
                    case 'camera_ready_template':
                      return FileText;
                    case 'flyer':
                      return FileImage;
                    default:
                      return FileText;
                  }
                };
                
                const IconComponent = getIcon(doc.category);
                
                return (
                  <Card
                    key={doc.id}
                    className="w-full relative overflow-hidden bg-card border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6 relative">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="p-3 rounded-xl bg-primary/10 transition-all duration-300">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.description || 'Download this document'}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={async () => {
                            if (doc.downloadUrl) {
                              try {
                                const response = await fetch(doc.downloadUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = doc.filename || 'document.pdf';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } catch (error) {
                                console.error('Download failed:', error);
                                window.open(doc.downloadUrl, '_blank');
                              }
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/20">
          <CardContent className="p-6 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
              Need More Information?
            </h3>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              For additional resources, formatting guidelines, or technical support,
              please visit our comprehensive author guidelines or contact support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="min-w-[180px] border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Author Guidelines
              </Button>

              <Button size="sm" className="min-w-[180px]">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DownloadsSection;

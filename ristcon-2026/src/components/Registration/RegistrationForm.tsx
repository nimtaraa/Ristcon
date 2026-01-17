import React from "react";
import { Download, Calendar, DollarSign, Info, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SectionHeader from "../SectionHeader";
import { useRegistration } from "@/hooks/useRegistration";
import { useDocuments } from "@/hooks/useDocuments";
import { useConference } from "@/hooks/useConference";

const RegistrationForm = () => {
  const { data: registrationData, isLoading: regLoading, isError: regError } = useRegistration();
  const { data: documentsData, isLoading: docsLoading } = useDocuments();
  const { data: conference, isLoading: confLoading } = useConference(undefined, 'important_dates');

  // Get registration deadline from important dates
  const registrationDeadline = conference?.important_dates?.find(d => d.date_type === 'registration_deadline');
  const deadline = registrationDeadline ? new Date(registrationDeadline.date_value) : new Date("2026-01-12");
  const formattedDeadline = deadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get registration fees from API
  const fees = registrationData?.data?.fees || [];
  
  // Get documents from API
  const documents = documentsData?.data || [];
  const registrationForm = documents.find(doc => doc.category === 'registration_form' && doc.isAvailable);
  const cameraReadyTemplate = documents.find(doc => doc.category === 'camera_ready_template' && doc.isAvailable);
  const declarationForm = documents.find(doc => doc.category === 'author_form' && doc.isAvailable);
  const flyer = documents.find(doc => doc.category === 'flyer' && doc.isAvailable);

  const downloads = [
    cameraReadyTemplate && { label: cameraReadyTemplate.title, href: cameraReadyTemplate.downloadUrl },
    declarationForm && { label: declarationForm.title, href: declarationForm.downloadUrl },
    flyer && { label: flyer.title, href: flyer.downloadUrl },
  ].filter(Boolean);

  // Get payment policies from API
  const policies = registrationData?.data?.policies || [];
  const paymentInfo = policies
    .filter(p => p.policy_type === 'requirement' || p.policy_type === 'restriction')
    .sort((a, b) => a.display_order - b.display_order)
    .map(p => p.policy_text);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 mb-8 pb-2 ">
        
        <SectionHeader title="Registration" />

        {/* Deadline Notice */}
        <Card className="mb-8 border-l-4 border-l-green-700 bg-gradient-to-r from-green-50/50 to-transparent">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex-shrink-0">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Important Deadline
              </h2>
              {confLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : registrationDeadline ? (
                <>
                  <p className="text-muted-foreground leading-relaxed">
                    All attendees, including presenters, must complete their registration by{" "}
                    <span className="text-green-700 font-bold">{formattedDeadline}</span> by
                    submitting the <span className="font-medium">Registration Form</span> available
                    under Downloads.
                  </p>
                  {registrationDeadline.notes && (
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      {registrationDeadline.notes}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  All attendees, including presenters, must complete their registration by{" "}
                  <span className="text-green-700 font-bold">{formattedDeadline}</span> by
                  submitting the <span className="font-medium">Registration Form</span> available
                  under Downloads.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Fee & Downloads */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Registration Fee */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              Registration Fee
            </h2>
            
            {regLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : regError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to load registration fees. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fees.map((fee) => {
                  const displayFee = fee.early_bird_amount && new Date(fee.early_bird_deadline!) > new Date()
                    ? `${fee.currency} ${fee.early_bird_amount}`
                    : `${fee.currency} ${fee.amount}`;
                  
                  return (
                    <Card
                      key={fee.fee_id}
                      className="w-full sm:w-auto border border-gray-200 bg-white shadow-sm rounded-lg"
                    >
                      <CardHeader className="pb-3 px-4 sm:px-6">                   
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                          {fee.attendee_type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-600 to-[#0A192F] bg-clip-text text-transparent">
                          {displayFee}
                        </p>
                        {fee.early_bird_amount && new Date(fee.early_bird_deadline!) > new Date() && (
                          <p className="text-sm text-gray-500 mt-1">
                            Early bird until {new Date(fee.early_bird_deadline!).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

        {/* Downloads */} 
       <section> 
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"> 
          <Download className="w-6 h-6 text-primary" /> Downloads 
         </h2> 

         {docsLoading ? (
           <div className="flex flex-col gap-3">
             <Skeleton className="h-14" />
             <Skeleton className="h-14" />
             <Skeleton className="h-14" />
           </div>
         ) : downloads.length > 0 ? (
           <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col gap-3 overflow-x-auto sm:overflow-visible">
             <div className="flex flex-col gap-3 overflow-x-auto"> 
               {downloads.map((doc) => ( 
                 <Button 
                   key={doc.label} 
                   asChild 
                   className="justify-start h-auto py-4 px-5 bg-gray-500 hover:scale-100 transform-none transition-none" 
                 > 
                   <a href={doc.href || '#'} className="flex items-center gap-3 w-full" download> 
                     <Download className="w-4 h-4 flex-shrink-0" /> 
                     <span className="text-left font-medium">{doc.label}</span> 
                   </a> 
                 </Button> 
               ))} 
             </div> 
           </div>
         ) : (
           <p className="text-muted-foreground">No documents available at this time.</p>
         )}
      </section>
        </div>

        {/* Method of Payment */}
        <section className="mb-12">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Info className="w-6 h-6 text-primary" />
                Method of Payment
              </CardTitle>
              <CardDescription>Please review the payment guidelines below</CardDescription>
            </CardHeader>
            <CardContent>
              {regLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ) : paymentInfo.length > 0 ? (
                <ul className="space-y-3">
                  {paymentInfo.map((info, idx) => {
                    const policy = policies.find(p => p.policy_text === info);
                    const isHighlighted = policy?.is_highlighted;
                    
                    return (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A192F] mt-2" />
                        <span className={isHighlighted ? "font-semibold text-foreground" : ""}>
                          {info}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">Payment information will be available soon.</p>
              )}
            </CardContent>
          </Card>
        </section>

        
      </div>
    </main>
  );
};

export default RegistrationForm;

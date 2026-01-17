import React from "react";
import { Download, Calendar, DollarSign, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

const RegistrationForm = () => {
  const deadline = new Date("2026-01-12");
  const formattedDeadline = deadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fees = [
    { title: "Foreign Attendees", fee: "USD 50", icon: DollarSign },
    { title: "Local Attendees", fee: "LKR 2500", icon: DollarSign },
  ];

  const downloads = [
    { label: "Template for Camera Ready Submission", href: "#" },
    { label: "Author Declaration Form", href: "#" },
    { label: "Conference Flyer", href: "#" },
  ];

  const paymentInfo = [
    "Presenters who make payments outside Sri Lanka should pay in USD.",
    "All bank charges should be borne by the presenters making the payment.",
    "Registration fees are non-refundable.",
  ];

  return (
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader title="Registration" />

        {/* Deadline Notice */}
        <Card className="mb-8 border-l-4 border-l-blue-700 bg-gradient-to-r from-green-50/50 to-transparent">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Important Deadline
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All attendees, including presenters, must complete their registration by{" "}
                <span className="text-green-700 font-bold">{formattedDeadline}</span> by
                submitting the <span className="font-medium">Registration Form</span> available
                under Downloads.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Registration fees should be paid using the provided payment method. Both the form
                and payment receipt must be uploaded to the CMT system by the deadline.
              </p>
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
            <div className="grid sm:grid-cols-2 gap-4">
              {fees.map(({ title, fee }) => (
                <Card
                  key={title}
                  className="border-border bg-white shadow-sm"
                >
                  <CardHeader className="pb-3">                   <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-primary bg-clip-text text-transparent">
                      {fee}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        {/* Downloads */} 
       <section> 
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"> 
          <Download className="w-6 h-6 text-primary" /> Downloads 
         </h2> 

        <div className="flex flex-col gap-3"> 
          {downloads.map(({ label, href }) => ( 
            <Button 
              key={label} 
              asChild 
              className="justify-start h-auto py-4 px-5 bg-gray-500 hover:scale-100 transform-none transition-none" 
              > 
              <a href={href} className="flex items-center gap-3 w-full"> 
                <Download className="w-4 h-4 flex-shrink-0" /> 
                <span className="text-left font-medium">{label}</span> 
             </a> 
            </Button> 
          ))} 
        </div> 
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
              <ul className="space-y-3">
                {paymentInfo.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A192F] mt-2" />
                    <span className={idx === 2 ? "font-semibold text-foreground" : ""}>
                      {info}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        
      </div>
    
  );
};

export default RegistrationForm;

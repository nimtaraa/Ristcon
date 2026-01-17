import React from "react";
import KeyAreasInteractive from "@/components/About/KeyAreasInteractive";
import TeamAccordion from "@/components/About/TeamAccordion";
import SectionHeader from "@/components/SectionHeader";

const About: React.FC = () => {
  return (
    <>
    <main
      className=" w-full mx-auto max-w-[1600px]
    pt-24 sm:pt-28 md:pt-24 lg:pt-28 xl:pt-28 2xl:pt-30
    px-4 sm:px-6 md:px-16 lg:px-16 xl:px-20 2xl:px-24
    pb-10 md:pb-16 lg:pb-20
      "
    >
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16">
      <SectionHeader title="Key Areas" />
      </div>
      <KeyAreasInteractive />
      <TeamAccordion/>
      
    </main>
    </>
  );
};

export default About;
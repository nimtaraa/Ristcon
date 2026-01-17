import React from "react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <header className="mb-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground sm:text-left mb-4">
        {title}
      </h1>
      <div className="h-1.5 w-24 bg-gradient-to-r from-[#0A192F] to-gray-100 rounded-full" />
    </header>
  );
};

export default SectionHeader;

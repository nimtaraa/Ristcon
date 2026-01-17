import AbstractFormats from "@/components/AuthorInstruction/AbstractFormats";
import CameraReady from "@/components/AuthorInstruction/Camera";
import Downloads from "@/components/AuthorInstruction/Download";
import PresentationGuidelines from "@/components/AuthorInstruction/Guidelines";
import ImportantNotes from "@/components/AuthorInstruction/ImportantNotes";
import SubmissionRequirements from "@/components/AuthorInstruction/SubmissionReq";
import SectionHeader from "@/components/SectionHeader";
import { useAuthorInstructions } from "@/hooks/useAuthorInstructions";

const AuthorInstructions = () => {
  const { data } = useAuthorInstructions();

  return (
  <div className="min-h-screen bg-background">
    <main
      className="
        w-full mx-auto max-w-[1400px] pt-28

        px-4          /* mobile */
        md:px-16      /* tablets */
        lg:px-16      /* small desktops */
        xl:px-20      /* large desktops */
        2xl:px-24     /* extra-large */
      "
    >
      {/* Section Header aligned like About */}
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionHeader title="Author Instructions" />
      </div>

      {/* Content section */}
      <section className="pb-8 w-full max-w-[1400px] mx-auto space-y-8">
        <SubmissionRequirements />
        <AbstractFormats />
        <ImportantNotes />
        <PresentationGuidelines />
        <CameraReady />
        <Downloads />

        {data?.config?.acknowledgment_text && (
          <div className="mt-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
            <p>
              <strong>CMT Acknowledgment:</strong> {data.config.acknowledgment_text}
            </p>
          </div>
        )}
      </section>
    </main>
  </div>
  );
};

export default AuthorInstructions;

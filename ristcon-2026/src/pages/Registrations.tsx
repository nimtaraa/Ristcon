import PaymentInfo from "@/components/Registration/PaymentInfo";
import RegistrationForm from "@/components/Registration/RegistrationForm";

const Registrations: React.FC = () => {
  return (
    <div>
      <main
        className="
          w-full mx-auto max-w-[1600px] pt-2 pb-16 px-2          /* mobile */
          md:pt-8 md:pb-16 md:px-16                           /* tablets */
          lg:pt-8 lg:pb-20 lg:px-16                           /* small desktops */
          xl:pt-6 xl:pb-24 xl:px-20                           /* large desktops */
          2xl:pt-10 2xl:pb-[100px] 2xl:px-24                   /* extra-large */
        "
      >
        <div className="w-full max-w-[1400px] mx-auto space-y-8">
          <RegistrationForm />
          <PaymentInfo />
        </div>
      </main>
    </div>
  );
};

export default Registrations;

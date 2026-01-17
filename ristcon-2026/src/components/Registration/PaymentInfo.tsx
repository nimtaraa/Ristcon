import React from "react";
import { motion } from "framer-motion";
import { Building2, Globe, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePaymentInformation } from "@/hooks/useRegistration";

type BankDetail = {
  label: string;
  value: string;
};

type BankDetailProps = {
  title: string;
  icon: React.ReactNode;
  data: BankDetail[];
  direction: "left" | "right";
};

const BankDetailCard: React.FC<BankDetailProps> = ({ title, icon, data, direction }) => {
  const fromX = direction === "left" ? -80 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="overflow-hidden border border-border bg-white shadow-sm">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span className="text-primary">{icon}</span>
            {title}
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-4 pb-2">
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-2 pb-4 border-b last:border-0 border-border"
              >
                <span className="font-medium text-gray-800">{item.label}</span>
                <span className="text-gray-600 break-words">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PaymentInfo = () => {
  const { data: paymentData, isLoading, isError } = usePaymentInformation();

  if (isLoading) {
    return (
      <section className="my-10 px-4 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Bank Details
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </section>
    );
  }

  if (isError || !paymentData?.data) {
    return (
      <section className="my-10 px-4 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Bank Details
        </h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load payment information. Please try again later.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  const paymentInfo = paymentData.data;
  const localPayment = paymentInfo.find(p => p.payment_type === 'local');
  const foreignPayment = paymentInfo.find(p => p.payment_type === 'foreign');

  const localDetails = localPayment ? [
    { label: "Beneficiary", value: localPayment.beneficiary_name },
    ...(localPayment.bank_address ? [{ label: "Address of Beneficiary", value: localPayment.bank_address }] : []),
    { label: "Bank Name", value: localPayment.bank_name },
    ...(localPayment.branch_name ? [{ label: "Branch", value: localPayment.branch_name }] : []),
    { label: "Account Number", value: localPayment.account_number },
    { label: "Currency", value: localPayment.currency },
    ...(localPayment.additional_info ? [{ label: "Note", value: localPayment.additional_info }] : []),
  ] : [];

  const foreignDetails = foreignPayment ? [
    { label: "Beneficiary", value: foreignPayment.beneficiary_name },
    { label: "Bank Name", value: foreignPayment.bank_name },
    ...(foreignPayment.branch_name ? [{ label: "Branch", value: foreignPayment.branch_name }] : []),
    ...(foreignPayment.swift_code ? [{ label: "SWIFT Code", value: foreignPayment.swift_code }] : []),
    { label: "Account Number", value: foreignPayment.account_number },
    { label: "Currency", value: foreignPayment.currency },
    ...(foreignPayment.additional_info ? [{ label: "Note", value: foreignPayment.additional_info }] : []),
  ] : [];

  return (
    <section className="my-10 px-4 lg:px-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" />
        Bank Details
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {localPayment && (
          <BankDetailCard
            title="Local Presenters"
            icon={<Building2 className="w-5 h-5" />}
            data={localDetails}
            direction="left"
          />
        )}
        {foreignPayment && (
          <BankDetailCard
            title="Foreign Presenters"
            icon={<Globe className="w-5 h-5" />}
            data={foreignDetails}
            direction="right"
          />
        )}
      </div>
    </section>
  );
};

export default PaymentInfo;

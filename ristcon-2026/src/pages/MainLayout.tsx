import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MainLayout = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

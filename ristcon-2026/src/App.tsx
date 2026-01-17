import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { YearProvider } from "@/contexts/YearContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthorInstructions from "./pages/AuthorInstructions";
import About from "./pages/About"; 
import Registrations from "./pages/Registrations";
import PastEventsPage from "./pages/PastEventsPage";
import ApiTest from "./pages/ApiTest";
import MainLayout from "./pages/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <YearProvider>
        <ScrollToTop />
        <Routes>
          {/* API Test Route - Outside MainLayout for clean testing */}
          <Route path="/api-test" element={<ApiTest />} />
          
          {/* Year-specific routes with slash (e.g., /ristcon/2026, /ristcon/2027) */}
          <Route path="/ristcon/:year" element={<MainLayout/>}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="author-instructions" element={<AuthorInstructions />} />
              <Route path="registration" element={<Registrations />} />
              <Route path="past-events" element={<PastEventsPage />} />
          </Route>
          
          {/* Default routes (no year specified - uses active edition) */}
          <Route path="/" element={<MainLayout/>}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="author-instructions" element={<AuthorInstructions />} />
              <Route path="registration" element={<Registrations />} />
              <Route path="past-events" element={<PastEventsPage />} />
          </Route>
          
          {/* 404 catch-all - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </YearProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;

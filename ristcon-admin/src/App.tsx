import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import EditionsPage from './pages/admin/editions/EditionsPage';
import SpeakersPage from './pages/admin/speakers/SpeakersPage';
import DatesPage from './pages/admin/dates/DatesPage';
import DocumentsPage from './pages/admin/documents/DocumentsPage';
import CommitteeMembersPage from './pages/admin/committee/CommitteeMembersPage';
import ResearchAreasPage from './pages/admin/research/ResearchAreasPage';
import AssetsPage from './pages/admin/assets/AssetsPage';
import ContactsPage from './pages/admin/contacts/ContactsPage';
import LocationsPage from './pages/admin/locations/LocationsPage';
import SocialMediaPage from './pages/admin/social-media/SocialMediaPage';
import RegistrationFeesPage from './pages/admin/registration-fees/RegistrationFeesPage';
import PaymentInfoPage from './pages/admin/payment-info/PaymentInfoPage';
import SubmissionMethodsPage from './pages/admin/submission-methods/SubmissionMethodsPage';
import PresentationGuidelinesPage from './pages/admin/presentation-guidelines/PresentationGuidelinesPage';
import AuthorConfigPage from './pages/admin/author-config/AuthorConfigPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/editions" replace />} />
              <Route path="editions" element={<EditionsPage />} />
              <Route path="speakers" element={<SpeakersPage />} />
              <Route path="dates" element={<DatesPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="committee" element={<CommitteeMembersPage />} />
              <Route path="research" element={<ResearchAreasPage />} />
              <Route path="assets" element={<AssetsPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="social-media" element={<SocialMediaPage />} />
              <Route path="registration-fees" element={<RegistrationFeesPage />} />
              <Route path="payment-info" element={<PaymentInfoPage />} />
              <Route path="submission-methods" element={<SubmissionMethodsPage />} />
              <Route path="presentation-guidelines" element={<PresentationGuidelinesPage />} />
              <Route path="author-config" element={<AuthorConfigPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

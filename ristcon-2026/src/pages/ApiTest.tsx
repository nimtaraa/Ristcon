/**
 * API Test Page
 * Test all API endpoints and verify data is being fetched correctly
 */

import { useConference } from '@/hooks/useConference';
import { useSpeakers } from '@/hooks/useSpeakers';
import { useImportantDates } from '@/hooks/useImportantDates';
import { useCommittees, useContacts } from '@/hooks/useCommittees';
import { useAvailableDocuments } from '@/hooks/useDocuments';
import { useActiveResearchAreas } from '@/hooks/useResearchAreas';
import { useLocation } from '@/hooks/useLocation';
import { useAuthorInstructions } from '@/hooks/useAuthorInstructions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function TestResult({ title, isLoading, isError, error, data, dataCount }: {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: unknown;
  dataCount?: number;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
          {!isLoading && !isError && <CheckCircle className="h-5 w-5 text-green-500" />}
          {isError && <XCircle className="h-5 w-5 text-red-500" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-gray-600">Loading...</p>}
        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error?.message || 'Unknown error'}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && (
          <div>
            <p className="text-green-600 font-semibold mb-2">
              ✓ Success {dataCount !== undefined && `(${dataCount} items)`}
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View Data
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ApiTestPage() {
  // Test all hooks
  const conference = useConference();
  const speakers = useSpeakers();
  const dates = useImportantDates();
  const committees = useCommittees();
  const contacts = useContacts();
  const documents = useAvailableDocuments();
  const researchAreas = useActiveResearchAreas();
  const location = useLocation();
  const authorInstructions = useAuthorInstructions();

  const allTests = [
    { hook: 'useConference', ...conference, count: conference.data ? 1 : 0 },
    { hook: 'useSpeakers', ...speakers, count: speakers.data?.data?.length || 0 },
    { hook: 'useImportantDates', ...dates, count: dates.data?.data?.length || 0 },
    { hook: 'useCommittees', ...committees, count: committees.data ? Object.keys(committees.data.data).length : 0 },
    { hook: 'useContacts', ...contacts, count: contacts.data?.data?.length || 0 },
    { hook: 'useDocuments', ...documents, count: documents.data?.data?.length || 0 },
    { hook: 'useResearchAreas', ...researchAreas, count: researchAreas.data?.data?.length || 0 },
    { hook: 'useLocation', ...location, count: location.data ? 1 : 0 },
    { hook: 'useAuthorInstructions', ...authorInstructions, count: authorInstructions.data ? 1 : 0 },
  ];

  const successCount = allTests.filter(t => !t.isLoading && !t.isError).length;
  const errorCount = allTests.filter(t => t.isError).length;
  const loadingCount = allTests.filter(t => t.isLoading).length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">🧪 API Integration Test</h1>
        <p className="text-gray-600 mb-6">
          Testing all 10 API endpoints to verify backend connectivity
        </p>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{successCount}</p>
                <p className="text-sm text-gray-600">Successful</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{errorCount}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{loadingCount}</p>
                <p className="text-sm text-gray-600">Loading</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Base URL Info */}
        <Alert className="mb-6">
          <AlertTitle>API Configuration</AlertTitle>
          <AlertDescription>
            <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1'}</p>
            <p><strong>Conference Year:</strong> {import.meta.env.VITE_CONFERENCE_YEAR || '2026'}</p>
            <p><strong>Environment:</strong> {import.meta.env.VITE_APP_ENV || 'development'}</p>
          </AlertDescription>
        </Alert>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-4">
        <TestResult
          title="1. Conference Endpoint"
          isLoading={conference.isLoading}
          isError={conference.isError}
          error={conference.error}
          data={conference.data}
          dataCount={conference.data ? 1 : 0}
        />

        <TestResult
          title="2. Speakers Endpoint"
          isLoading={speakers.isLoading}
          isError={speakers.isError}
          error={speakers.error}
          data={speakers.data}
          dataCount={speakers.data?.data?.length}
        />

        <TestResult
          title="3. Important Dates Endpoint"
          isLoading={dates.isLoading}
          isError={dates.isError}
          error={dates.error}
          data={dates.data}
          dataCount={dates.data?.data?.length}
        />

        <TestResult
          title="4. Committees Endpoint"
          isLoading={committees.isLoading}
          isError={committees.isError}
          error={committees.error}
          data={committees.data}
          dataCount={committees.data ? Object.keys(committees.data.data).length : 0}
        />

        <TestResult
          title="5. Contacts Endpoint"
          isLoading={contacts.isLoading}
          isError={contacts.isError}
          error={contacts.error}
          data={contacts.data}
          dataCount={contacts.data?.data?.length}
        />

        <TestResult
          title="6. Documents Endpoint"
          isLoading={documents.isLoading}
          isError={documents.isError}
          error={documents.error}
          data={documents.data}
          dataCount={documents.data?.data?.length}
        />

        <TestResult
          title="7. Research Areas Endpoint"
          isLoading={researchAreas.isLoading}
          isError={researchAreas.isError}
          error={researchAreas.error}
          data={researchAreas.data}
          dataCount={researchAreas.data?.data?.length}
        />

        <TestResult
          title="8. Location Endpoint"
          isLoading={location.isLoading}
          isError={location.isError}
          error={location.error}
          data={location.data}
          dataCount={location.data ? 1 : 0}
        />

        <TestResult
          title="9. Author Instructions Endpoint"
          isLoading={authorInstructions.isLoading}
          isError={authorInstructions.isError}
          error={authorInstructions.error}
          data={authorInstructions.data}
          dataCount={authorInstructions.data ? 1 : 0}
        />
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📝 Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure the Laravel backend is running at <code className="bg-gray-100 px-2 py-1 rounded">configured API URL</code></li>
            <li>Check that all endpoints show green checkmarks (✓ Success)</li>
            <li>Click "View Data" to inspect the actual API responses</li>
            <li>Verify data counts match expected values:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Conference: 1 item (RISTCON 2026)</li>
                <li>Speakers: 3 items (1 keynote, 2 plenary)</li>
                <li>Important Dates: 4 items</li>
                <li>Committees: 3 groups (Advisory, Editorial, Organizing)</li>
                <li>Contacts: 2 items</li>
                <li>Documents: 2-3 items (available only)</li>
                <li>Research Areas: 5 categories</li>
                <li>Location: 1 item</li>
                <li>Author Instructions: 1 item</li>
              </ul>
            </li>
            <li>If any test fails, check the error message and verify backend is running</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

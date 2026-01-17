import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

interface YearContextType {
  selectedYear: string | number | undefined;
  setSelectedYear: (year: string | number | undefined) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export function YearProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string | number | undefined>();

  useEffect(() => {
    // Method 1: Extract year from URL path 
    // Matches both: /ristcon/2026 and /ristcon2026
    const pathMatch = location.pathname.match(/ristcon[\/]?(\d{4})/i);
    if (pathMatch) {
      setSelectedYear(pathMatch[1]);
      return;
    }

    // Method 2: Read year from URL query parameter (e.g., ?year=2027)
    const yearParam = searchParams.get('year');
    if (yearParam) {
      setSelectedYear(yearParam);
      return;
    }

    // Method 3: No year specified - falls back to undefined
    // Hooks will use CONFERENCE_YEAR constant which fetches the active edition
    setSelectedYear(undefined);
  }, [searchParams, location.pathname]);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
}

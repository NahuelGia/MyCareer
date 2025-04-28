import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubjectsData } from '../types/subjects';
import { SubjectsStorageService } from '../services/storage/local-storage';

interface SubjectsContextType {
  subjectsData: SubjectsData | null;
  setSubjectsData: (data: SubjectsData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjectsData, setSubjectsData] = useState<SubjectsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await SubjectsStorageService.initialize();
        setSubjectsData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error loading data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <SubjectsContext.Provider 
      value={{ 
        subjectsData,
        setSubjectsData,
        isLoading,
        setIsLoading,
        error,
        setError
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider');
  }
  return context;
} 
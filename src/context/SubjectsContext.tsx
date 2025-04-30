import { createContext, useContext, useState, ReactNode } from 'react';
import { SubjectsData } from '../types/subjects';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
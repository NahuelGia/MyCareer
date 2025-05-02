import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SubjectsData } from '../types/subjects';
import { SubjectsStorageService } from '../services/storage/local-storage';

interface CareerWithProgress {
  id: string;
  nombre: string;
  data: SubjectsData;
}

interface SubjectsContextType {
  subjectsData: CareerWithProgress[];
  setSubjectsData: (data: CareerWithProgress[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  loadCareersProgress: () => Promise<void>;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjectsData, setSubjectsData] = useState<CareerWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadCareersProgress = async () => {
    try {
      setIsLoading(true);
      const allData = await SubjectsStorageService.getAllCareersProgress();
      const careersWithProgress = Object.entries(allData)
        .filter(([_, data]) => data !== null)
        .map(([id, data]) => ({
          id,
          nombre: data!.nombre,
          data: data!
        }));
      setSubjectsData(careersWithProgress);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCareersProgress();
  }, []);

  return (
    <SubjectsContext.Provider 
      value={{ 
        subjectsData,
        setSubjectsData,
        isLoading,
        setIsLoading,
        error,
        setError,
        loadCareersProgress
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
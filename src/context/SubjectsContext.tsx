import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SubjectsData } from "../types/subjects";
import { SubjectsStorageService } from "../services/storage/local-storage";
import { useUser } from "./UserContext";

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
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  saved: boolean;
  setSaved: (saved: boolean) => void;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(
  undefined
);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const { user, isFetchingUser } = useUser();
  const [subjectsData, setSubjectsData] = useState<CareerWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadCareersProgress = async () => {
    try {
      setIsLoading(true);
      const allData = await SubjectsStorageService.getAllCareersProgress(
        user?.id
      );

      const careersWithProgress = Object.entries(allData)
        .filter(([_, data]) => data !== null)
        .map(([id, data]) => ({
          id,
          nombre: data!.nombre,
          data: data!,
        }));

      setSubjectsData(careersWithProgress);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error loading data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetchingUser) {
      loadCareersProgress();
    }
  }, [user, isFetchingUser]);

  return (
    <SubjectsContext.Provider
      value={{
        subjectsData,
        setSubjectsData,
        isLoading,
        setIsLoading,
        error,
        setError,
        loadCareersProgress,
        isSaving,
        setIsSaving,
        saved,
        setSaved,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}

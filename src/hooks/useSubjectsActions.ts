import { useSubjects } from '../context/SubjectsContext';
import { SubjectsStorageService } from '../services/storage/local-storage';

export function useSubjectsActions() {
  const { setSubjectsData, setError } = useSubjects();

  const updateSubjectStatus = async (subjectId: string, newStatus: string) => {
    try {
      const updatedData = await SubjectsStorageService.updateSubjectStatus(subjectId, newStatus);
      setSubjectsData(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating status'));
    }
  };

  return { updateSubjectStatus };
} 
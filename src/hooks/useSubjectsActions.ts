import { useSubjects } from '../context/SubjectsContext';
import { SubjectsStorageService } from '../services/storage/local-storage';
import { toaster } from '@components/ui/toaster';

export function useSubjectsActions() {
  const { setSubjectsData, setError } = useSubjects();

  const updateSubjectStatus = async (subjectId: string, newStatus: string) => {
    try {
      const updatedData = await SubjectsStorageService.updateSubjectStatus(subjectId, newStatus);
      setSubjectsData(updatedData);
      
      toaster.create({
        title: 'Se guardo el progreso.',
        description: `La materia ha sido marcada como ${newStatus.toLowerCase()}.`,
        type: 'info',
        duration: 6000,
        meta: {
          closable: true,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating status'));
      
      toaster.create({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la materia',
        type: 'error',
        duration: 3000,
        meta: {
          closable: true,
        },
      });
    }
  };

  return { updateSubjectStatus };
} 
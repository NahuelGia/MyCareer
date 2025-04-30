import { useSubjects } from '../context/SubjectsContext';
import { SubjectsStorageService } from '../services/storage/local-storage';
import { toaster } from '@components/ui/toaster';
import { useParams } from 'react-router';

export function useSubjectsActions() {
  const { setSubjectsData, setError } = useSubjects();
  const { id } = useParams();

  const updateSubjectStatus = async (subjectId: string, newStatus: string) => {
    if (!id) {
      toaster.create({
        title: 'Error',
        description: 'No se encontró la carrera seleccionada',
        type: 'error',
        duration: 3000,
        meta: {
          closable: true,
        },
      });
      return;
    }

    try {
      const updatedData = await SubjectsStorageService.updateSubjectStatus(id, subjectId, newStatus);
      
      if (!updatedData) {
        // If update failed, try to reload the data
        const reloadedData = await SubjectsStorageService.getData(id);
        if (!reloadedData) {
          throw new Error('No se pudieron cargar los datos después de la actualización');
        }
        setSubjectsData(reloadedData);
      } else {
        setSubjectsData(updatedData);
      }
      
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
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado de la materia';
      setError(new Error(errorMessage));
      
      toaster.create({
        title: 'Error',
        description: errorMessage,
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
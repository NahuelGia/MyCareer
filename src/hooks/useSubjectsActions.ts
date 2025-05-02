import { useSubjects } from '../context/SubjectsContext';
import { SubjectsStorageService } from '../services/storage/local-storage';
import { toaster } from '@components/ui/toaster';
import { useParams } from 'react-router';

export function useSubjectsActions() {
  const { setSubjectsData, setError } = useSubjects();
  const { id } = useParams();

  const initializeCareer = async () => {
    if (!id) return;

    try {
      const careerData = await SubjectsStorageService.getData(id);
      if (!careerData) {
        const initializedData = await SubjectsStorageService.initialize(id);
        setSubjectsData([{ id, nombre: initializedData.nombre, data: initializedData }]);
      } else {
        setSubjectsData([{ id, nombre: careerData.nombre, data: careerData }]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al inicializar la carrera';
      setError(new Error(errorMessage));
      toaster.create({
        title: 'Error',
        description: errorMessage,
        type: 'error',
        duration: 3000,
        meta: { closable: true },
      });
    }
  };

  const updateSubjectStatus = async (
    subjectId: string, 
    newStatus: string,
    nota?: string,
    periodo?: string,
    comentarios?: string
  ) => {
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
      const updatedData = await SubjectsStorageService.updateSubjectStatus(
        id, 
        subjectId, 
        newStatus,
        nota,
        periodo,
        comentarios
      );
      
      if (!updatedData) {
        // If update failed, try to reload the data
        const reloadedData = await SubjectsStorageService.getData(id);
        if (!reloadedData) {
          // Si no hay datos, inicializamos la carrera
          const initializedData = await SubjectsStorageService.initialize(id);
          setSubjectsData([{ id, nombre: initializedData.nombre, data: initializedData }]);
        } else {
          setSubjectsData([{ id, nombre: reloadedData.nombre, data: reloadedData }]);
        }
      } else {
        setSubjectsData([{ id, nombre: updatedData.nombre, data: updatedData }]);
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

  return { updateSubjectStatus, initializeCareer };
} 
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSubjects } from '../../../context/SubjectsContext';
import { SubjectsStorageService } from '../../../services/storage/local-storage';

export function useInitializeSubjects() {
  const { id } = useParams();
  const { setSubjectsData, setIsLoading, setError } = useSubjects();

  useEffect(() => {
    const loadInitialData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await SubjectsStorageService.initialize(id);
        setSubjectsData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error loading data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id, setSubjectsData, setIsLoading, setError]);
} 
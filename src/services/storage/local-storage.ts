import { SubjectsData, Subject } from '../../types/subjects';
import { carreras } from '../../pages/materias/utils/jsonDbs';

const isSubjectAvailable = (subject: Subject, allSubjects: Subject[]): boolean => {
    if (subject.data.prerequisites.length === 0) {
        return true;
    }

    return subject.data.prerequisites.every(prereqLabel => {
        const prerequisite = allSubjects.find(s => s.data.label === prereqLabel);
        if (!prerequisite) return false;
        
        if (prerequisite.data.status !== "Completada") return false;
        
        return isSubjectAvailable(prerequisite, allSubjects);
    });
};

const updateSubjectsAvailability = (subjects: Subject[]): Subject[] => {
    return subjects.map(subject => ({
        ...subject,
        data: {
            ...subject.data,
            available: isSubjectAvailable(subject, subjects)
        }
    }));
};

export class SubjectsStorageService {
  static async initialize(careerId: string): Promise<SubjectsData> {
    const STORAGE_KEY = `${careerId}_data`;
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      const carrera = carreras.find(c => c.id === careerId);
      if (!carrera) {
        throw new Error(`No se encontraron datos para la carrera ${careerId}`);
      }

      const careerData = await import(`../../pages/materias/utils/jsonDbs/${carrera.file}`);
      const updatedData = {
        ...careerData.default,
        nombre: carrera.nombre,
        materias: updateSubjectsAvailability(careerData.default.materias as Subject[])
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      return updatedData;
    }

    const parsedData = JSON.parse(storedData);
    return {
      ...parsedData,
      materias: updateSubjectsAvailability(parsedData.materias)
    };
  }

  static async getData(careerId: string): Promise<SubjectsData | null> {
    const STORAGE_KEY = `${careerId}_data`;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsedData = JSON.parse(data);
    return {
      ...parsedData,
      materias: updateSubjectsAvailability(parsedData.materias)
    };
  }

  static async getAllCareersProgress(): Promise<Record<string, SubjectsData | null>> {
    const progress: Record<string, SubjectsData | null> = {};
    
    for (const carrera of carreras) {
      progress[carrera.id] = await this.getData(carrera.id);
    }
    
    return progress;
  }

  static async updateSubjectStatus(
    careerId: string,
    subjectId: string,
    newStatus: string,
    nota?: string,
    periodo?: string,
    comentarios?: string
  ): Promise<SubjectsData | null> {
    const STORAGE_KEY = `${careerId}_data`;
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      // Si no hay datos, inicializamos la carrera
      return await this.initialize(careerId);
    }

    const parsedData = JSON.parse(data);
    const updatedMaterias = parsedData.materias.map((m: Subject) => {
      if (m.id === subjectId) {
        return {
          ...m,
          data: {
            ...m.data,
            status: newStatus,
            nota: nota ?? m.data.nota,
            periodo: periodo ?? m.data.periodo,
            comentarios: comentarios ?? m.data.comentarios
          }
        };
      }
      return m;
    });

    const updatedData = {
      ...parsedData,
      materias: updateSubjectsAvailability(updatedMaterias)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  }

  static async deleteCareerProgress(careerId: string): Promise<void> {
    const STORAGE_KEY = `${careerId}_data`;
    localStorage.removeItem(STORAGE_KEY);
  }
}
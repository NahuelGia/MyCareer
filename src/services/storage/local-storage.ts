import { SubjectsData, Subject } from '../../types/subjects';
import { carreras } from '../../pages/materias/utils/jsonDbs';

const isSubjectAvailable = (subject: Subject, allSubjects: Subject[]): boolean => {
    if (subject.data.prerequisites.length === 0) {
        return true;
    }

    return subject.data.prerequisites.every(prereqLabel => {
        const prerequisite = allSubjects.find(s => s.data.label === prereqLabel);
        return prerequisite && prerequisite.data.status === "Completada";
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

  static async updateSubjectStatus(careerId: string, subjectId: string, newStatus: string): Promise<SubjectsData | null> {
    const STORAGE_KEY = `${careerId}_data`;
    const data = await this.getData(careerId);
    if (!data) {
      throw new Error(`No se encontraron datos para la carrera ${careerId}`);
    }

    const subject = data.materias.find(s => s.id === subjectId);
    if (!subject) {
      throw new Error(`No se encontró la materia con ID ${subjectId}`);
    }

    const updatedSubjects = data.materias.map((subject: Subject) => 
      subject.id === subjectId 
        ? { ...subject, data: { ...subject.data, status: newStatus } }
        : subject
    );
    
    const updatedData = {
      ...data,
      materias: updateSubjectsAvailability(updatedSubjects)
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      throw new Error('Error al guardar los cambios en el almacenamiento local');
    }
  }
}
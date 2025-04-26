import { SubjectsData, Subject } from '../../types/subjects';
import tpiData from '../../pages/materias/utils/jsonDbs/tpi.json';

const STORAGE_KEY = 'tpi_data';

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
  static async initialize(): Promise<SubjectsData> {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      const updatedData = {
        ...tpiData,
        materias: updateSubjectsAvailability(tpiData.materias as Subject[])
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

  static async getData(): Promise<SubjectsData | null> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsedData = JSON.parse(data);
    return {
      ...parsedData,
      materias: updateSubjectsAvailability(parsedData.materias)
    };
  }

  static async updateSubjectStatus(subjectId: string, newStatus: string): Promise<SubjectsData | null> {
    const data = await this.getData();
    if (!data) return null;

    const updatedSubjects = data.materias.map((subject: Subject) => 
      subject.id === subjectId 
        ? { ...subject, data: { ...subject.data, status: newStatus } }
        : subject
    );
    
    const updatedData = {
      ...data,
      materias: updateSubjectsAvailability(updatedSubjects)
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  }
}
import { SubjectsData, Subject } from '../../types/subjects';
import tpiData from '../../pages/materias/utils/jsonDbs/tpi.json';

const STORAGE_KEY = 'tpi_data';

export class SubjectsStorageService {
  static async initialize(): Promise<SubjectsData> {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tpiData));
      return tpiData;
    }
    return JSON.parse(storedData);
  }

  static async getData(): Promise<SubjectsData> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  static async updateSubjectStatus(subjectId: string, newStatus: string): Promise<SubjectsData> {
    const data = await this.getData();
    const updatedData = {
      ...data,
      materias: data.materias.map((subject: Subject) => 
        subject.id === subjectId 
          ? { ...subject, data: { ...subject.data, status: newStatus } }
          : subject
      )
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  }
}
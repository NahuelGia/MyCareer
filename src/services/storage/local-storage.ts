import { SubjectsData, Subject } from "../../types/subjects";
import { carreras } from "../../pages/materias/utils/jsonDbs";
import { getUserTreeData, updateUserData } from "@/lib/supabaseClient";

const isSubjectAvailable = (subject: Subject, allSubjects: Subject[]): boolean => {
   if (subject.data.prerequisites.length === 0) {
      return true;
   }

   return subject.data.prerequisites.every((prereqLabel) => {
      const prerequisite = allSubjects.find((s) => s.data.label === prereqLabel);
      if (!prerequisite) return false;

      if (prerequisite.data.status !== "Completada") return false;

      return isSubjectAvailable(prerequisite, allSubjects);
   });
};

const updateSubjectsAvailability = (subjects: Subject[]): Subject[] => {
   return subjects.map((subject) => ({
      ...subject,
      data: {
         ...subject.data,
         available: isSubjectAvailable(subject, subjects),
      },
   }));
};

export class SubjectsStorageService {
   static async initialize(careerId: string): Promise<SubjectsData> {
      const STORAGE_KEY = `${careerId}_data`;
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (!storedData) {
         const carrera = carreras.find((c) => c.id === careerId);
         if (!carrera) {
            throw new Error(`No se encontraron datos para la carrera ${careerId}`);
         }

         const careerData = await import(
            `../../pages/materias/utils/jsonDbs/${carrera.file}`
         );
         const updatedData = {
            ...careerData.default,
            nombre: carrera.nombre,
            materias: updateSubjectsAvailability(careerData.default.materias as Subject[]),
         };
         localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
         return updatedData;
      }

      const parsedData = JSON.parse(storedData);
      return {
         ...parsedData,
         materias: updateSubjectsAvailability(parsedData.materias),
      };
   }

   static async getData(careerId: string): Promise<SubjectsData | null> {
      const STORAGE_KEY = `${careerId}_data`;
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsedData = JSON.parse(data);
      return {
         ...parsedData,
         materias: updateSubjectsAvailability(parsedData.materias),
      };
   }

   static async getAllCareersProgress(
      userId?: string
   ): Promise<Record<string, SubjectsData | null>> {
      if (userId) {
         const supabaseData = await getUserTreeData(userId);
         Object.entries(supabaseData).forEach(([careerId, data]) => {
            const storageKey = `${careerId}_data`;
            data
               ? localStorage.setItem(storageKey, JSON.stringify(data))
               : localStorage.removeItem(storageKey);
         });

         return supabaseData;
      }

      const localData: Record<string, SubjectsData | null> = {};
      for (const carrera of carreras) {
         localData[carrera.id] = await this.getData(carrera.id);
      }
      return localData;
   }

   static async updateSubjectStatus({
      careerId,
      subjectId,
      newStatus,
      nota,
      periodo,
      comentarios,
      userId,
   }: {
      careerId: string;
      subjectId: string;
      newStatus: string;
      nota?: string;
      periodo?: string;
      comentarios?: string;
      userId?: string;
   }): Promise<SubjectsData | null> {
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
                  comentarios: comentarios ?? m.data.comentarios,
               },
            };
         }
         return m;
      });

      const updatedData = {
         ...parsedData,
         materias: updateSubjectsAvailability(updatedMaterias),
      };

      if (userId) {
         updateUserData(userId, STORAGE_KEY, updatedData);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

      return updatedData;
   }

   static async deleteCareerProgress(careerId: string): Promise<void> {
      const STORAGE_KEY = `${careerId}_data`;
      localStorage.removeItem(STORAGE_KEY);
   }
}

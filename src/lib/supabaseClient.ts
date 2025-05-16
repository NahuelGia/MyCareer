import { toaster } from "@/components/ui/toaster";
import { carreras } from "@/pages/materias/utils/jsonDbs";
import { CareerDataName } from "@/types/entities/CareerData";
import { UserData } from "@/types/entities/UserData";
import { SubjectData, SubjectsData } from "@/types/subjects";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const createUserData = async (userId: string) => {
   const userData = await supabase.from("use_data").select("*").eq("id", userId);
   if (!userData.data) {
      const careersData = (
         await supabase
            .from("career_data")
            .select("data")
            .eq("data_name", CareerDataName.ACADEMIC_TREE)
            .single()
      ).data?.data;

      const dataJson: Record<string, string | null> = {};

      const storageKeys = Object.keys(localStorage).filter(
         (k) => !k.includes("auth-token")
      );

      // if the user has progress in local storage, we save it to the db
      storageKeys.forEach((k) => {
         const data = localStorage.getItem(k);
         if (!data) return;
         dataJson[k] = JSON.parse(data);
      });

      // add the missing careers
      Object.keys(careersData).forEach((key) => {
         if (!dataJson[`${key}_data`]) {
            dataJson[key] = careersData[key];
         }
      });

      //TODO ver si es necesario agregar el calendar selection

      try {
         const res = await supabase.from("user_data").insert({
            id: userId,
            data: dataJson || {},
         });
      } catch (error) {
         console.error("Error inserting user data:", error);
      }
   }
};

export const getUserTreeData = async (
   userId: string
): Promise<Record<string, SubjectsData | null>> => {
   const subjectsData: Record<string, SubjectsData> = {};

   const userData = (
      await supabase.from("user_data").select("data").eq("id", userId).single()
   ).data?.data;

   carreras.forEach((carrera) => {
      subjectsData[carrera.id] = userData?.[`${carrera.id}_data`] ?? null;
   });

   return subjectsData;
};
export const updateUserData = async (
   userId: string,
   dataKey: string,
   updatedData: any
) => {
   try {
      const userData = (
         await supabase.from("user_data").select("data").eq("id", userId).single()
      ).data?.data;
      userData[dataKey] = updatedData;
      await supabase.from("user_data").update({ data: userData }).eq("id", userId);
   } catch (error) {
      toaster.create({
         title: "Error",
         description: "Error al intentar guardar los datos",
         type: "error",
         duration: 3000,
         meta: {
            closable: true,
         },
      });
   }
};

export const loadUserCalendarData = async (userId: string, dataKey: string) => {
   const userData = (
      await supabase.from("user_data").select("data").eq("id", userId).single()
   ).data?.data;

   if (!userData || !userData[dataKey]) {
      return null;
   }

   const calendarData = userData[dataKey];
   localStorage.setItem(dataKey, JSON.stringify(calendarData));
   return calendarData;
};

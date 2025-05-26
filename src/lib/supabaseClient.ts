import { toaster } from "@/components/ui/toaster";
import { CareerData } from "@/pages/creator/components/SubjectTreeEditor";
import { CareerDataName } from "@/types/entities/CareerData";
import { UserData } from "@/types/entities/UserData";
import { SubjectData, SubjectsData } from "@/types/subjects";
import { createClient } from "@supabase/supabase-js";
import { use } from "react";

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

   const carreras = await getCarreras(userId);

   Object.keys(carreras).forEach((key) => {
      const data = userData?.[`${key}_data`];
      subjectsData[key] = data || carreras[key];
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

export const getCarreras = async (userId?: string) => {
   const queryResult = await supabase
      .from("career_data")
      .select("data")
      .eq("data_name", CareerDataName.ACADEMIC_TREE);
   let response = queryResult.data ? queryResult.data[0].data : null;

   if (userId) {
      const customCarrerasDataRes = (
         await supabase
            .from("custom_carreras")
            .select("academic_tree")
            .eq("user_id", userId)
      ).data;

      const customCarrerasData =
         customCarrerasDataRes && customCarrerasDataRes[0]?.academic_tree;

      response = {
         ...response,
         ...customCarrerasData,
      };
   }
   return response || [];
};

export const createCustomCarrera = async (userId: string, carreraData: CareerData) => {
   let newCarrera: Record<string, CareerData> = {};

   const response = (
      await supabase.from("custom_carreras").select("academic_tree").eq("user_id", userId)
   ).data;
   const customCareers = response && response[0] ? response[0].academic_tree : null;

   if (customCareers) {
      newCarrera = {
         ...customCareers,
         [carreraData.id]: carreraData,
      };
   }

   newCarrera[carreraData.id] = carreraData;

   await supabase
      .from("custom_carreras")
      .upsert({ user_id: userId, academic_tree: newCarrera }, { onConflict: "user_id" });
};

export const getUsedCarreraNames = async (userId: string) => {
   const customResponse = (
      await supabase.from("custom_carreras").select("academic_tree").eq("user_id", userId)
   ).data;

   const defaultReponse = await supabase
      .from("career_data")
      .select("data")
      .eq("data_name", CareerDataName.ACADEMIC_TREE);

   const customCareers =
      customResponse && customResponse[0] ? customResponse[0].academic_tree : null;
   const defaultCareers = defaultReponse.data ? defaultReponse.data[0].data : null;

   const usedNames: string[] = Object.keys(customCareers).map(
      (key) => customCareers[key].id
   );
   Object.keys(defaultCareers).forEach((key) => {
      const carrera = defaultCareers[key];
      usedNames.push(carrera.id);
      usedNames.push(carrera.nombre.toUpperCase());
   });

   return usedNames;
};

export const getUserCustomCarrera = async (careerId: string, userId: string) => {
   const customResponse = (
      await supabase.from("custom_carreras").select("academic_tree").eq("user_id", userId)
   ).data;

   const customCareers =
      customResponse && customResponse[0] ? customResponse[0].academic_tree : null;

   return customCareers[careerId];
};

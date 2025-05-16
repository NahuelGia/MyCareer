import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createUserData, supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { isSameDay } from "@/pages/calendario/utils/jsonDbs/helper";
import { carreras } from "@/pages/materias/utils/jsonDbs";

interface UserContextType {
   user: User | null;
   signOut: () => Promise<void>;
   isFetchingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [isFetchingUser, setIsFetchingUser] = useState(true);
   const [createdData, setCreatedData] = useState(false);

   useEffect(() => {
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => { // Esto hace que al cambiar de pestaña se vea refresque la pagina
         const currentUser = session?.user ?? null;
         setUser(currentUser);
         setIsFetchingUser(false);

         if (event === "SIGNED_OUT") {
            carreras.forEach((c) => localStorage.removeItem(`${c.id}_data`));
         }
      });

      return () => subscription.unsubscribe();
   }, []);

   useEffect(() => {
      if (user?.created_at && !createdData) {
         const createdAtDate = new Date(user.created_at);
         const today = new Date();

         if (isSameDay(createdAtDate, today)) {
            createUserData(user.id);
            setCreatedData(true);
         }
      }
   }, [user]);

   const signOut = async () => {
      await supabase.auth.signOut();
      setUser(null);
   };

   return (
      <UserContext.Provider value={{ user, signOut, isFetchingUser }}>
         {children}
      </UserContext.Provider>
   );
};
export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) {
      throw new Error("useUser must be used within a UserProvider");
   }
   return context;
};

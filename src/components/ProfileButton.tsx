import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Avatar, AvatarGroup, Box, Button, Popover, Text } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser } from "@/context/UserContext";

export const ProfileButton = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { user, signOut } = useUser();

   return (
      <>
         <Popover.Root positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger>
               {user ? (
                  <AvatarGroup
                     onClick={() => setIsModalOpen(true)}
                     cursor={"pointer"}
                     _hover={{ opacity: 0.8 }}
                  >
                     <Avatar.Root>
                        <Avatar.Fallback />
                        <Avatar.Image src={user.user_metadata.avatar_url} />
                     </Avatar.Root>
                  </AvatarGroup>
               ) : (
                  <Button onClick={() => setIsModalOpen(true)}>Iniciar sesión</Button>
               )}
            </Popover.Trigger>
            <Popover.Positioner>
               <Popover.Content>
                  <Popover.CloseTrigger />
                  <Popover.Body border={"1px solid"} borderColor="gray.200">
                     {user ? (
                        <Box textAlign="center">
                           <Text mb={2} fontWeight="semibold">
                              ¡Hola, {user.user_metadata?.full_name || "Usuario"}!
                           </Text>
                           <Button size="sm" colorScheme="red" onClick={() => signOut()}>
                              Cerrar sesión
                           </Button>
                        </Box>
                     ) : (
                        <>
                           <Text textAlign="center" mb={4} fontWeight="semibold">
                              Iniciar con Google
                           </Text>
                           <Auth
                              supabaseClient={supabase}
                              providers={["google"]}
                              onlyThirdPartyProviders
                              appearance={{ theme: ThemeSupa }}
                           />
                        </>
                     )}
                  </Popover.Body>
               </Popover.Content>
            </Popover.Positioner>
         </Popover.Root>
      </>
   );
};

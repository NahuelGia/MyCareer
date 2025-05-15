import { Box, Flex, Text, Link } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router";
import { useSubjects } from "../context/SubjectsContext";
import { ProfileButton } from "./ProfileButton";

interface NavbarProps {
   customTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ customTitle }) => {
   const location = useLocation();
   const { id } = useParams();
   const { subjectsData } = useSubjects();

   let screenDescription = "Home";

   if (location.pathname === "/") {
      screenDescription = "Selector de Carrera";
   } else if (location.pathname === "/creator") {
      screenDescription = "Creador de Carrera";
   } else if (id) {
      const career = subjectsData.find((c) => c.id === id);
      if (career) {
         screenDescription = career.nombre;
      } else {
         screenDescription = "Carrera";
      }
   }

   return (
      <Box
         as="nav"
         position="sticky"
         top="0"
         zIndex="10"
         width="100%"
         py={3}
         px={6}
         bg="white"
         boxShadow="md"
      >
         <Flex justify="space-between" align="center">
            <Link href="/" _hover={{ textDecoration: "none" }}>
               <Text fontWeight="bold" fontSize="xl" color="blue.600">
                  MyCareer
               </Text>
            </Link>

            <Text fontWeight="medium" fontSize="md">
               {customTitle || screenDescription}
            </Text>

            <ProfileButton />
         </Flex>
      </Box>
   );
};

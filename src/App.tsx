import {
   Box,
   Text,
   VStack,
   Heading,
   Container,
   Center,
   Flex,
   Button,
} from "@chakra-ui/react";
import { useSubjects } from "./context/SubjectsContext";
import { CareerCard } from "./components/CareerCard";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { useUser } from "./context/UserContext";
import { Link } from "react-router";

export default function Page() {
   const { subjectsData, isLoading, loadCareersProgress, carreras } = useSubjects();
   const { isFetchingUser, user } = useUser();

   useEffect(() => {
      loadCareersProgress();
   }, []);

   if (isLoading || isFetchingUser) {
      return (
         <Center h="100vh">
            <VStack gap="2">
               <Heading size="7xl" color="blue.600">
                  MyCareer
               </Heading>
               <Text>Cargando carreras...</Text>
            </VStack>
         </Center>
      );
   }

   return (
      <Flex minH="100vh" direction="column">
         <Navbar />
         <Container maxW="container.lg" py={20} flex="1">
            <Center>
               <VStack gap={8} align="center">
                  <VStack gap={2} align="center">
                     <Heading size="7xl" color="blue.600" textAlign="center">
                        MyCareer
                     </Heading>
                     <Text fontSize="2xl" color="gray.600" textAlign="center">
                        Tu progreso académico en un solo lugar
                     </Text>
                  </VStack>

                  <VStack gap={4} width="full" maxW="600px" align="center">
                     <Box maxHeight="50vh" overflowY="auto" pr={2} pt={2} flexShrink={0}>
                        <VStack>
                           {Object.keys(carreras).map((key) => {
                              const careerProgress = subjectsData.find(
                                 (c) => c.id === key
                              );
                              const carrera = carreras[key];
                              return (
                                 <CareerCard
                                    key={carrera.id}
                                    carrera={carrera}
                                    careerProgress={careerProgress}
                                 />
                              );
                           })}
                        </VStack>
                     </Box>
                     {user && (
                        <Link to={"/creator"}>
                           <Button
                              bg={"gray.200"}
                              borderColor={"gray.300"}
                              color={"black"}
                              _hover={{
                                 transform: "translateY(-2px)",
                                 boxShadow: "md",
                                 borderColor: "gray.300",
                              }}
                           >
                              Crear progreso
                           </Button>
                        </Link>
                     )}
                  </VStack>
               </VStack>
            </Center>
         </Container>
      </Flex>
   );
}

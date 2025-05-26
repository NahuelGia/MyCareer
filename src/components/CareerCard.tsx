import { Box, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import { Link } from "react-router";
import { RiTimeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

interface Materia {
   id: string;
   data: {
      status: string;
   };
}

interface Carrera {
   id: string;
   nombre: string;
}

interface CareerWithProgress {
   id: string;
   data: {
      materias: Materia[];
   };
}

interface CareerCardProps {
   carrera: Carrera;
   careerProgress?: CareerWithProgress;
}

export const CareerCard = ({ carrera, careerProgress }: CareerCardProps) => {
   const hasProgress = !!careerProgress;

   const completedSubjects =
      careerProgress?.data.materias.filter((m: Materia) => m.data.status === "Completada")
         .length || 0;
   const totalSubjects = careerProgress?.data.materias.length || 0;
   const progressPercentage =
      totalSubjects > 0 ? (completedSubjects / totalSubjects) * 100 : 0;

   return (
      <Box
         width="full"
         bg={hasProgress ? "green.50" : "transparent"}
         borderWidth="1px"
         borderColor={hasProgress ? "green.200" : "gray.200"}
         borderRadius="md"
         p={4}
         _hover={{
            transform: "translateY(-2px)",
            boxShadow: "md",
            borderColor: hasProgress ? "green.300" : "gray.300",
         }}
         transition="all 0.2s"
      >
         <HStack width="full" justify="space-between" align="start">
            <Link to={`/${carrera.id}`} style={{ width: "100%" }}>
               <VStack align="start" gap={2}>
                  <HStack width="full" justify="space-between">
                     <Text fontWeight="medium" maxW={"18rem"}>
                        {carrera.nombre}
                     </Text>
                     {hasProgress && (
                        <HStack>
                           <Icon as={RiTimeLine} color="green.500" />
                           <Text fontSize="sm" color="green.600">
                              En progreso
                           </Text>
                        </HStack>
                     )}
                  </HStack>
                  {hasProgress && (
                     <VStack width="full" align="start" gap={1}>
                        <HStack width="full" justify="space-between">
                           <Text fontSize="sm" color="gray.600">
                              {completedSubjects} de {totalSubjects} materias completadas
                           </Text>

                           <Text fontSize="sm" color="green.600" fontWeight="medium">
                              {Math.round(progressPercentage)}%
                           </Text>
                        </HStack>
                        <Box
                           width="full"
                           height="2"
                           bg="gray.100"
                           borderRadius="full"
                           overflow="hidden"
                        >
                           <Box
                              width={`${progressPercentage}%`}
                              height="full"
                              bg="green.500"
                           />
                        </Box>
                     </VStack>
                  )}
               </VStack>
            </Link>
            {carrera.id !== "LI" && carrera.id !== "TPI" && (
               <Link to={`creator/${carrera.id}`}>
                  <Icon as={FiEdit} color="green.500" mt={1} ml={2} boxSize="18px" />
               </Link>
            )}
         </HStack>
      </Box>
   );
};

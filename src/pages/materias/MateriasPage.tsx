import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import TreeChart from './components/AcademicTree/AcademicTree'; 	
import { Toaster } from "@components/ui/toaster"
import { useInitializeSubjects } from './hooks/useInitializeSubjects';
import { useSubjects } from '../../context/SubjectsContext';

export const MateriasPage = () => {
  useInitializeSubjects();

  const { subjectsData } = useSubjects();

  if (!subjectsData) {
    return null;
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="2xl" textAlign="center">{subjectsData.nombre}</Heading>
      <VStack align="start" mb={4}>
        <Heading as="h2" size="lg">Mi trayecto</Heading>
      </VStack>

      <Box bg="gray.100" p={4} height="600px">
        <TreeChart />
      </Box>

      {/* Stats*/}
      <VStack align="start" mt={4}>
        <Text fontSize="md">Progress bar and stats button :P</Text>
      </VStack>
      <Toaster />
    </Box>
  );
};

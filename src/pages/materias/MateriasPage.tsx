import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import TreeChart from './components/AcademicTree/AcademicTree'; 	

export const MateriasPage = () => {
  return (
    <Box p={4}>
      {/* Tittle */}
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
    </Box>
  );
};

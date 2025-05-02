import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import TreeChart from './components/AcademicTree/AcademicTree'; 	
import { Toaster } from "@components/ui/toaster"
import { useSubjects } from '../../context/SubjectsContext';
import { useParams, useNavigate } from 'react-router';
import { useSubjectsActions } from '../../hooks/useSubjectsActions';
import { useEffect, useState } from 'react';
import { SubjectsStorageService } from '../../services/storage/local-storage';
import { RiSettings3Line } from 'react-icons/ri';
import { SettingsModal } from './components/SettingsModal/SettingsModal';

export const MateriasPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjectsData, isLoading } = useSubjects();
  const { initializeCareer } = useSubjectsActions();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    initializeCareer();
  }, [id]);

  const handleDeleteProgress = async () => {
    if (!id) return;
    
    try {
      await SubjectsStorageService.deleteCareerProgress(id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting progress:', err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!subjectsData) {
    return null;
  }

  const careerData = subjectsData.find(c => c.id === id);
  if (!careerData) {
    return null;
  }

  return (
    <Box p={4} position="relative" minH="100vh">
      <Heading as="h1" size="2xl" textAlign="center">{careerData.nombre}</Heading>

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

      <Button
        position="fixed"
        right="20px"
        bottom="20px"
        onClick={() => setShowSettings(true)}
        borderRadius="full"
        p={0}
        w="40px"
        h="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <RiSettings3Line />
      </Button>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onDeleteProgress={handleDeleteProgress}
      />
    </Box>
  );
};

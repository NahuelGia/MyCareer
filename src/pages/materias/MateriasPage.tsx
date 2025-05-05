import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import TreeChart from './components/AcademicTree/AcademicTree'; 	
import { Toaster } from "@components/ui/toaster"
import { useSubjects } from '../../context/SubjectsContext';
import { useParams, useNavigate } from 'react-router';
import { useSubjectsActions } from '../../hooks/useSubjectsActions';
import { useEffect, useState } from 'react';
import { SubjectsStorageService } from '../../services/storage/local-storage';
import { RiSettings3Line, RiBarChartLine } from 'react-icons/ri';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { AcademicProgressBar } from './components/AcademicProgressBar';
import { StatisticsModal } from './components/StatisticsModal/StatisticsModal';
import { Navbar } from '../../components/Navbar';

export const MateriasPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjectsData, isLoading } = useSubjects();
  const { initializeCareer } = useSubjectsActions();
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

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

  const materias = careerData.data.materias || [];
  const total = materias.length;
  const approved = materias.filter(m => m.data.status === 'Completada').length;
  const remaining = total - approved;

  const totalCredits = materias.reduce((sum, subject) => sum + subject.data.credits, 0);

  const passedSubjects = materias.filter(m => m.data.status === 'Completada');

  const promedio = passedSubjects.length > 0 
    ? passedSubjects.reduce((sum, subject) => {
        const grade = subject.data.nota ? parseFloat(subject.data.nota) : 0;
        return sum + grade;
      }, 0) / passedSubjects.length
    : 0;

  const calculateRemainingTerms = () => {
    const periods = new Set();
    passedSubjects.forEach(subject => {
      if (subject.data.periodo) {
        periods.add(subject.data.periodo);
      }
    });
    
    const subjectsPerSemester = periods.size > 0 
      ? passedSubjects.length / periods.size 
      : 5;
    
    return Math.ceil(remaining / subjectsPerSemester);
  };

  const estimatedRemainingTerms = calculateRemainingTerms();

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      
      <Box p={4} flex="1">
        <Heading as="h1" size="2xl" textAlign="center" mt={4}>{careerData.nombre}</Heading>

        <VStack align="start" mb={4}>
          <Heading as="h2" size="lg">Mi trayecto</Heading>
        </VStack>

        <Box bg="gray.100" p={4} height="600px">
          <TreeChart />
        </Box>

        {/* Stats*/}
        <VStack align="start" mt={4}>
          <AcademicProgressBar approved={approved} total={total} />
        </VStack>
        <Toaster/>

        {/* Bottom buttons */}
        <HStack 
          position="fixed"
          right="20px"
          bottom="20px"
          gap={4}
        >
          <Button
            onClick={() => setShowStatistics(true)}
            borderRadius="full"
            p={0}
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            colorScheme="blue"
          >
            <RiBarChartLine />
          </Button>
          <Button
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
        </HStack>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onDeleteProgress={handleDeleteProgress}
        />

        <StatisticsModal
          isOpen={showStatistics}
          onClose={() => setShowStatistics(false)}
          subjects={materias}
          totalCredits={totalCredits}
          approved={approved}
          remaining={remaining}
          promedio={promedio}
          estimatedRemainingTerms={estimatedRemainingTerms}
        />
      </Box>
    </Box>
  );
};

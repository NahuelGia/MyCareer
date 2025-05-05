import { Box, Heading, Grid, GridItem, Text, Center, VStack } from '@chakra-ui/react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';
import { Subject } from '../../../../types/subjects';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  totalCredits: number;
  approved: number;
  remaining: number;
  promedio: number;
  estimatedRemainingTerms: number;
}

export const StatisticsModal = ({ 
  isOpen, 
  onClose, 
  subjects,
  totalCredits,
  approved,
  remaining,
  promedio,
  estimatedRemainingTerms
}: StatisticsModalProps) => {
  if (!isOpen) return null;

  // Calculate credits earned
  const creditsEarned = subjects
    .filter(subject => subject.data.status === 'Completada')
    .reduce((sum, subject) => sum + subject.data.credits, 0);

  // Data for credits pie chart
  const creditsData = [
    { name: 'Créditos obtenidos', value: creditsEarned, fill: '#4299E1' },
    { name: 'Créditos restantes', value: totalCredits - creditsEarned, fill: '#A0AEC0' }
  ];

  // Data for subjects completion pie chart
  const subjectsData = [
    { name: 'Materias aprobadas', value: approved, fill: '#48BB78' },
    { name: 'Materias restantes', value: remaining, fill: '#A0AEC0' }
  ];

  // Promedio data by period for line chart
  const getPromedioByPeriod = () => {
    // Group passed subjects by period
    const subjectsByPeriod: Record<string, Subject[]> = {};
    const completedSubjects = subjects.filter(subject => subject.data.status === 'Completada' && subject.data.periodo && subject.data.nota);
    
    // First build the data structure to group subjects by period
    completedSubjects.forEach(subject => {
      const period = subject.data.periodo;
      if (!subjectsByPeriod[period]) {
        subjectsByPeriod[period] = [];
      }
      subjectsByPeriod[period].push(subject);
    });
    
    // Calculate average for each period
    const periodAverages = Object.entries(subjectsByPeriod).map(([period, periodSubjects]) => {
      const average = periodSubjects.reduce((sum: number, subject: Subject) => {
        const grade = parseFloat(subject.data.nota || '0') || 0;
        return sum + grade;
      }, 0) / periodSubjects.length;
      
      return {
        period,
        promedio: Number(average.toFixed(2)),
        promedioGeneral: Number(promedio.toFixed(2))
      };
    });
    
    // Sort periods chronologically
    return periodAverages.sort((a, b) => {
      // Assuming format like "1-2023" (semester-year)
      const [semA, yearA] = a.period.split('-');
      const [semB, yearB] = b.period.split('-');
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      return parseInt(semA) - parseInt(semB);
    });
  };
  
  const promediosByPeriod = getPromedioByPeriod();

  // Calculate subjects per semester based on period data
  const calculateDetailedSubjectsPerSemester = () => {
    // Group passed subjects by period
    const subjectsByPeriod: Record<string, Subject[]> = {};
    const completedSubjects = subjects.filter(subject => subject.data.status === 'Completada' && subject.data.periodo);
    
    // First build the data structure to group subjects by period
    completedSubjects.forEach(subject => {
      const period = subject.data.periodo || 'Unknown';
      if (!subjectsByPeriod[period]) {
        subjectsByPeriod[period] = [];
      }
      subjectsByPeriod[period].push(subject);
    });

    // Create period data with counts
    const periodsData = Object.entries(subjectsByPeriod).map(([period, periodSubjects]) => ({
      period,
      count: periodSubjects.length
    }));

    // Sort periods chronologically
    const sortedPeriodsData = periodsData.sort((a, b) => {
      // Assuming format like "1-2023" (semester-year)
      const [semA, yearA] = a.period.split('-');
      const [semB, yearB] = b.period.split('-');
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      return parseInt(semA) - parseInt(semB);
    });

    // Get average subjects per semester
    const totalSubjects = completedSubjects.length;
    const totalPeriods = sortedPeriodsData.length;
    const averagePerSemester = totalPeriods > 0 ? totalSubjects / totalPeriods : 0;
    
    return {
      averagePerSemester,
      periodsData: sortedPeriodsData,
      estimatedTerms: Math.ceil(remaining / (averagePerSemester || 1)) // Avoid division by zero
    };
  };

  const subjectsPerSemesterData = calculateDetailedSubjectsPerSemester();

  // Calculate weekly hours by period
  const calculateWeeklyHoursByPeriod = () => {
    // Group subjects by period
    const subjectsByPeriod: Record<string, Subject[]> = {};
    const completedSubjects = subjects.filter(subject => subject.data.status === 'Completada' && subject.data.periodo);
    
    // First build the data structure to group subjects by period
    completedSubjects.forEach(subject => {
      const period = subject.data.periodo || 'Unknown';
      if (!subjectsByPeriod[period]) {
        subjectsByPeriod[period] = [];
      }
      subjectsByPeriod[period].push(subject);
    });

    // Calculate total weekly hours for each period
    const periodHoursData = Object.entries(subjectsByPeriod).map(([period, periodSubjects]) => {
      const totalHours = periodSubjects.reduce((sum, subject) => {
        return sum + (subject.data.weeklyHours || 0);
      }, 0);
      
      return {
        period,
        hours: totalHours
      };
    });

    // Sort periods chronologically
    return periodHoursData.sort((a, b) => {
      // Assuming format like "1-2023" (semester-year)
      const [semA, yearA] = a.period.split('-');
      const [semB, yearB] = b.period.split('-');
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      return parseInt(semA) - parseInt(semB);
    });
  };

  const weeklyHoursData = calculateWeeklyHoursByPeriod();

  // Custom colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        maxW="800px"
        w="90%"
        h="80%"
        overflowY="auto"
        onClick={e => e.stopPropagation()}
      >
        <Heading size="lg" mb={6} textAlign="center">Estadísticas académicas</Heading>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {/* Credits earned pie chart */}
          <GridItem>
            <Heading size="md" mb={2} textAlign="center">Créditos obtenidos</Heading>
            <Text textAlign="center" mb={4}>{creditsEarned} / {totalCredits} créditos</Text>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={creditsData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  nameKey="name"
                >
                  {creditsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GridItem>

          {/* Subjects completion pie chart */}
          <GridItem>
            <Heading size="md" mb={2} textAlign="center">Materias aprobadas</Heading>
            <Text textAlign="center" mb={4}>{approved} / {approved + remaining} materias</Text>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={subjectsData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  nameKey="name"
                >
                  {subjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GridItem>

          {/* Promedio Line Chart */}
          <GridItem>
            <Heading size="md" mb={2} textAlign="center">Promedio General</Heading>
            <Text textAlign="center" mb={4}>{promedio.toFixed(2)} / 10.0</Text>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={promediosByPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="promedio" 
                  stroke="#8884d8" 
                  name="Promedio por periodo" 
                  isAnimationActive={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="promedioGeneral" 
                  stroke="#82ca9d" 
                  name="Promedio general" 
                  strokeDasharray="5 5"
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </GridItem>

          {/* Semestres restantes - Large number display */}
          <GridItem>
            <Heading size="md" mb={4} textAlign="center">Semestres restantes</Heading>
            <Center>
              <VStack>
                <Text 
                  fontSize="6xl" 
                  fontWeight="bold" 
                  color={subjectsPerSemesterData.estimatedTerms > 5 ? "red.500" : "green.500"}
                >
                  {subjectsPerSemesterData.estimatedTerms}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Basado en un promedio de {subjectsPerSemesterData.averagePerSemester.toFixed(1)} materias por semestre
                </Text>
              </VStack>
            </Center>
          </GridItem>

          {/* Bar chart for subjects per period */}
          <GridItem>
            <Heading size="md" mb={2} textAlign="center">Promedio de materias aprobadas</Heading>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectsPerSemesterData.periodsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis label={{ value: 'Materias', angle: -90, position: 'insideLeft' }} />
                <Tooltip labelFormatter={(label) => `Periodo: ${label}`} formatter={(value) => [`${value} materias`, 'Aprobadas']} />
                <Bar dataKey="count" name="Materias aprobadas" fill="#82ca9d" isAnimationActive={false} />
                <ReferenceLine y={subjectsPerSemesterData.averagePerSemester} stroke="red" strokeDasharray="3 3">
                  <Label value="Promedio" position="right" />
                </ReferenceLine>
              </BarChart>
            </ResponsiveContainer>
          </GridItem>

          {/* Weekly Study Hours chart */}
          <GridItem>
            <Heading size="md" mb={2} textAlign="center">Horas de estudio semanales por periodo</Heading>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} horas`, 'Horas semanales']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8884d8" 
                  name="Horas semanales" 
                  isAnimationActive={false}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine 
                  y={weeklyHoursData.reduce((sum, item) => sum + item.hours, 0) / weeklyHoursData.length} 
                  stroke="red" 
                  strokeDasharray="3 3"
                >
                  <Label value="Promedio" position="right" />
                </ReferenceLine>
              </LineChart>
            </ResponsiveContainer>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}; 
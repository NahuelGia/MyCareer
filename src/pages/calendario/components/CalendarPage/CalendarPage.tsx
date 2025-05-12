import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  HStack, 
  VStack, 
  Text, 
  Heading, 
  Flex
} from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../../../../components/Navbar';
import { useSubjects } from '../../../../context/SubjectsContext';
import { BasicCheckbox } from '../../../../components/Checkbox';
import tpiData from '../../utils/jsonDbs/tpi.json';
import { CalendarStorageService } from '../../../../services/storage/calendar-storage';

// Define CalendarEvent type with the new structure
interface CalendarEvent {
  title: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  extendedProps: {
    comisiones: string[];
  };
  color?: string;
}

// Define a type for single event with comision
interface CalendarDisplayEvent extends Omit<CalendarEvent, 'extendedProps'> {
  extendedProps: {
    comision: string;
    comisiones: string[];
  };
}

// Define a type for the user's selections
interface SubjectSelection {
  title: string;
  comision: string;
  isSelected: boolean;
}

const STORAGE_KEY_PREFIX = 'calendar_selections';

// Default career data mapping - in a real application, this would be more dynamic
// or loaded from an API
const careerCalendarData: Record<string, any> = {
  'tpi': tpiData.data,
  // Add other career data here as needed
  // 'licenciatura': licenciaturaData.data,
  // etc.
};

const generateUniqueColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 20);
  const lightness = 35 + (Math.abs(hash) % 25);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { subjectsData, isLoading } = useSubjects();
  const [subjectEvents, setSubjectEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComisiones, setSelectedComisiones] = useState<Record<string, string>>({});
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  // Get the career-specific storage key
  const getStorageKey = () => {
    if (!id) return STORAGE_KEY_PREFIX;
    return `${STORAGE_KEY_PREFIX}_${id}`;
  };

  // Load events and saved selections from localStorage
  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
      try {
        // Use career-specific data if available, otherwise fall back to tpiData
        // In a real application, this would be more dynamic or loaded from an API
        const careerData = careerCalendarData[id] || tpiData.data;
        setSubjectEvents(careerData);
        
        // Load saved selections from localStorage with career-specific key
        const savedSelections = localStorage.getItem(getStorageKey());
        if (savedSelections) {
          const parsed = JSON.parse(savedSelections);
          setSelections(parsed.selections || {});
          setSelectedComisiones(parsed.selectedComisiones || {});
        } else {
          // If no saved selections exist for this career, reset to empty state
          setSelections({});
          setSelectedComisiones({});
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading calendar events or saved selections:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]); // Include id in dependency array to reload data when career changes

  // Save selections to localStorage whenever they change
  useEffect(() => {
    if (!loading && id) {
      localStorage.setItem(getStorageKey(), JSON.stringify({
        selections,
        selectedComisiones
      }));
    }
  }, [selections, selectedComisiones, loading, id]);

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!subjectsData || !id) {
    return null;
  }

  const careerData = subjectsData.find(c => c.id === id);
  if (!careerData) {
    return null;
  }

  // Create a list of unique subjects with their comisiones
  const uniqueSubjects: Record<string, { title: string, comisiones: string[] }> = {};
  
  subjectEvents.forEach(event => {
    if (!uniqueSubjects[event.title]) {
      uniqueSubjects[event.title] = {
        title: event.title,
        comisiones: []
      };
    }
    
    // Add unique comisiones to the list
    event.extendedProps.comisiones.forEach(comision => {
      if (!uniqueSubjects[event.title].comisiones.includes(comision)) {
        uniqueSubjects[event.title].comisiones.push(comision);
      }
    });
  });

  const handleSubjectToggle = (subjectTitle: string) => {
    const comision = selectedComisiones[subjectTitle];
    const key = `${subjectTitle}_${comision}`;
    
    setSelections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleComisionChange = (subjectTitle: string, comision: string) => {
    const oldComision = selectedComisiones[subjectTitle];
    const oldKey = `${subjectTitle}_${oldComision}`;
    const newKey = `${subjectTitle}_${comision}`;
    const wasSelected = selections[oldKey] || false;
    
    // Create a new selections object removing any other comisiones of this subject
    const newSelections = { ...selections };
    
    // Remove the selection state for the old comision
    if (oldKey in newSelections) {
      delete newSelections[oldKey];
    }
    
    // Set the new comision's selection state to match the old one
    newSelections[newKey] = wasSelected;
    
    // Update the selected comision
    setSelectedComisiones(prev => ({
      ...prev,
      [subjectTitle]: comision
    }));
    
    // Update all selections
    setSelections(newSelections);
  };

  // Filter events based on selections
  const filteredEvents: CalendarDisplayEvent[] = [];
  
  subjectEvents.forEach(event => {
    // Check if any comision of this subject is selected
    const selectedComision = selectedComisiones[event.title];
    
    if (selectedComision) {
      // Only process events that contain the selected comision
      if (event.extendedProps.comisiones.includes(selectedComision)) {
        const key = `${event.title}_${selectedComision}`;
        
        // Check if this specific comision is selected
        if (selections[key]) {
          // Create a new event for this specific comision
          filteredEvents.push({
            title: `${event.title} - ${selectedComision}`,
            daysOfWeek: event.daysOfWeek,
            startTime: event.startTime,
            endTime: event.endTime,
            extendedProps: {
              comision: selectedComision,
              comisiones: event.extendedProps.comisiones
            },
            color: generateUniqueColor(event.title)
          });
        }
      }
    }
  });

  const handleBack = () => {
    navigate(`/materias/${id}`);
  };

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column">
      <Navbar customTitle="Horario Semanal" />
      
      <Box p={4} flex="1" display="flex">
        {/* Sidebar */}
        <Box
          w="300px"
          bg="gray.50"
          p={4}
          borderRadius="md"
          boxShadow="md"
          mr={4}
          overflowY="auto"
          maxH="calc(100vh - 100px)"
        >
          <Heading as="h3" size="md" mb={4}>Mis Materias</Heading>
          <VStack align="start" gap={3}>
            {Object.entries(uniqueSubjects).map(([title, subject]) => {
              // Initialize the selected comision if not already set
              if (!selectedComisiones[title] && subject.comisiones.length > 0) {
                selectedComisiones[title] = subject.comisiones[0];
              }
              
              const selectedComision = selectedComisiones[title] || '';
              const selectionKey = `${title}_${selectedComision}`;
              const isSelected = selections[selectionKey] || false;
              
              return (
                <Box key={title} width="100%" p={2} borderWidth="1px" borderRadius="md">
                  <Flex align="center" mb={2}>
                    <BasicCheckbox 
                      checked={isSelected} 
                      onCheckedChange={() => handleSubjectToggle(title)}
                      label=""
                    />
                    <Text fontWeight="bold" ml={2}>{title}</Text>
                  </Flex>
                  <select 
                    value={selectedComision} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleComisionChange(title, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.4rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white'
                    }}
                  >
                    {subject.comisiones.map(comision => (
                      <option key={comision} value={comision}>
                        {comision}
                      </option>
                    ))}
                  </select>
                </Box>
              );
            })}
          </VStack>
        </Box>
        
        {/* Calendar */}
        <Box flex="1">
          <HStack justify="flex-start" mb={4}>
            <Button 
              onClick={handleBack}
              variant="outline"
            >
              <Box mr={2} display="inline-flex">
                <RiArrowLeftLine />
              </Box>
              Volver
            </Button>
          </HStack>
          
          <Box 
            bg="white" 
            borderRadius="md" 
            boxShadow="md" 
            p={2} 
            h="calc(100vh - 200px)"
          >
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: '',
                center: '',
                right: ''
              }}
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="23:00:00"
              weekends={true}
              hiddenDays={[0]}
              events={filteredEvents}
              height="100%"
              locale="es"
              dayHeaders={true}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              slotDuration="01:00:00"
              dayHeaderFormat={{
                weekday: 'long'
              }}
              editable={false}
              selectable={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}; 
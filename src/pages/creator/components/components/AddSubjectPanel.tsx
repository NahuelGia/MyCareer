import { useState } from "react";
import { Box, Button, VStack, Text, Input, HStack } from "@chakra-ui/react";
import { DegreeModule } from "@/types/enums/degreeModule";
import { Node, useNodesState } from "@xyflow/react";
import { SubjectNode } from "../SubjectTreeEditor";

interface AddSubjectPanelProps {
   nodes: Node[];
   setNodes: ReturnType<typeof useNodesState>[1];
   careerData: any;
   setCareerData: React.Dispatch<React.SetStateAction<any>>;
}

export const AddSubjectPanel = ({
   nodes,
   setNodes,
   careerData,
   setCareerData,
}: AddSubjectPanelProps) => {
   const [newSubject, setNewSubject] = useState({
      nombre: "",
      degreeModule: DegreeModule.INTRODUCTORIO,
      weeklyHours: 0,
      credits: 0,
   });

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setNewSubject((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const addNewSubject = () => {
      const newNode: SubjectNode = {
         id: Date.now().toString(),
         type: "subject",
         position: { x: Math.random() * 400, y: Math.random() * 400 },
         data: {
            nombre: newSubject.nombre,
            degreeModule: newSubject.degreeModule,
            weeklyHours: newSubject.weeklyHours,
            credits: newSubject.credits,
         },
      };

      setNodes((nds) => [...nds, newNode]);
      setNewSubject({
         nombre: "",
         degreeModule: DegreeModule.INTRODUCTORIO,
         weeklyHours: 0,
         credits: 0,
      });
   };

   const isFormValid =
      newSubject.nombre.trim() !== "" &&
      newSubject.weeklyHours > 0 &&
      newSubject.credits > 0;

   return (
      <Box bg="white" p={4} borderRadius="md" boxShadow="md" w="400px">
         <VStack gap={4} align="stretch">
            <Text fontWeight="bold">Agregar Nueva Materia</Text>
            <Input
               name="nombre"
               value={newSubject.nombre}
               onChange={handleInputChange}
               placeholder="Nombre de la materia"
               borderColor={!newSubject.nombre ? "red.500" : "gray.200"}
            />
            <select
               name="degreeModule"
               value={newSubject.degreeModule}
               onChange={handleInputChange}
               style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0" }}
            >
               {Object.values(DegreeModule).map((degreeModule) => (
                  <option key={degreeModule} value={degreeModule}>
                     {degreeModule}
                  </option>
               ))}
            </select>
            <VStack align="stretch" gap={2}>
               <Text fontSize="sm" fontWeight="medium">
                  Carga Horaria
               </Text>
               <Input
                  name="weeklyHours"
                  type="number"
                  value={newSubject.weeklyHours}
                  onChange={handleInputChange}
                  placeholder="Horas semanales"
                  min={0}
                  size="sm"
                  borderColor={!newSubject.weeklyHours || newSubject.weeklyHours == 0   ? "red.500" : "gray.200"}
               />
               <Text fontSize="sm" fontWeight="medium">
                  Créditos
               </Text>
               <Input
                  name="credits"
                  type="number"
                  value={newSubject.credits}
                  onChange={handleInputChange}
                  placeholder="Créditos"
                  min={0}
                  size="sm"
                  borderColor={!newSubject.credits || newSubject.credits == 0  ? "red.500" : "gray.200"}
               />
            </VStack>
            <Button
               onClick={addNewSubject}
               colorScheme="blue"
               flex={1}
               h="40px"
               disabled={!isFormValid}
            >
               Agregar Materia
            </Button>
            <Text fontSize="sm" color="gray.600">
               Para crear dependencias, arrastra desde el punto de conexión de una materia
               hasta otra
            </Text>
         </VStack>
      </Box>
   );
};

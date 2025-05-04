import { Box, Button, VStack, Text, Input, HStack } from "@chakra-ui/react";
import { Panel } from "@xyflow/react";
import { DegreeModule } from "@/types/enums/degreeModule";
import { SubjectNode } from "./SubjectTreeEditor";

interface EditPanelProps {
  selectedNode: SubjectNode;
  onUpdate: (data: Partial<SubjectNode['data']>) => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const EditPanel = ({ selectedNode, onUpdate, onCancel, onSave, onDelete }: EditPanelProps) => {
  return (
    <Panel position="top-left">
      <Box bg="white" p={4} borderRadius="md" boxShadow="md" w="400px">
        <VStack gap={4} align="stretch">
          <Text fontWeight="bold">Editar Materia</Text>
          <Input
            value={selectedNode.data.nombre}
            onChange={(e) => onUpdate({ nombre: e.target.value })}
            placeholder="Nombre de la materia"
          />
          <select
            value={selectedNode.data.degreeModule}
            onChange={(e) => onUpdate({ degreeModule: e.target.value as DegreeModule })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0" }}
          >
            {Object.values(DegreeModule).map((degreeModule) => (
              <option key={degreeModule} value={degreeModule}>
                {degreeModule}
              </option>
            ))}
          </select>
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" fontWeight="medium">Carga Horaria</Text>
            <Input
              type="number"
              value={selectedNode.data.weeklyHours}
              onChange={(e) => onUpdate({ weeklyHours: parseInt(e.target.value) })}
              placeholder="Horas semanales"
              min={0}
              size="sm"
            />
            <Text fontSize="sm" fontWeight="medium">Créditos</Text>
            <Input
              type="number"
              value={selectedNode.data.credits}
              onChange={(e) => onUpdate({ credits: parseInt(e.target.value) })}
              placeholder="Créditos"
              min={0}
              size="sm"
            />
          </VStack>
          <HStack>
            <Button onClick={onDelete} colorScheme="red" flex={1}>
              Eliminar
            </Button>
            <Button onClick={onCancel} colorScheme="gray" flex={1}>
              Cancelar
            </Button>
            <Button onClick={onSave} colorScheme="blue" flex={1}>
              Guardar
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Panel>
  );
}; 
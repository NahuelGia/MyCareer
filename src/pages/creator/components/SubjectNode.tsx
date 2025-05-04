import { Handle, Position } from "@xyflow/react";
import { Box, Text } from "@chakra-ui/react";
import { DegreeModule } from "@/types/enums/degreeModule";
import { useState } from "react";

interface SubjectNodeProps {
  data: {
    nombre: string;
    degreeModule: DegreeModule;
    weeklyHours: number;
    credits: number;
  };
}

const SubjectNode = ({ data }: SubjectNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <Box
          minW="250px"
          position="absolute"
          top="100%"
          left="50%"
          transform="translateX(-50%)"
          mt={2}
          p={2}
          bg="white"
          color="black"
          borderRadius="md"
          boxShadow="md"
          zIndex={9999}
        >
          <Text fontWeight="bold">{data.nombre}</Text>
          <Text fontSize="sm">Módulo: {data.degreeModule}</Text>
          <Text fontSize="sm">Carga horaria: {data.weeklyHours}hs</Text>
          <Text fontSize="sm">Créditos: {data.credits}</Text>
        </Box>
      )}
      <Box
        p={2}
        borderRadius="md"
        bg="white"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        w="150px"
        h="80px"
        alignItems="center"
        justifyContent="center"
        display="flex"
      >
        <Handle type="target" position={Position.Top} />
        <Text textAlign="center" fontSize="12px">
          {data.nombre}
        </Text>
        <Handle type="source" position={Position.Bottom} />
      </Box>
    </Box>
  );
};

export default SubjectNode; 
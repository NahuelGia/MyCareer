import {
  Box,
  GridItem,
  IconButton,
  Portal,
  Text,
  Button,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import DataGrid from "./DataGrid";

interface MateriaData {
  label: string;
  status: string;
  prerequisites?: any;
  credits?: number;
  weeklyHours: number;
  degreeModule: string;
}

interface ModalMateriaProps {
  isOpen: boolean;
  data: MateriaData;
  status: string;
  nota: string;
  setNota: (value: string) => void;
  periodo: string;
  setPeriodo: (value: string) => void;
  onClose: () => void;
  setStatus: (newStatus: string) => void;
  comentarios: string;
  setComentarios: (value: string) => void;
  onSave: (
    newStatus: string,
    newNota: string,
    newPeriodo: string,
    newComentarios: string
  ) => void;
}

export default function ModalMateria({
  isOpen,
  data,
  status,
  nota,
  setNota,
  periodo,
  setPeriodo,
  onClose,
  setStatus,
  comentarios,
  setComentarios,
  onSave,
}: ModalMateriaProps) {
  const [tempStatus, setTempStatus] = useState(status);
  const [tempNota, setTempNota] = useState(nota);
  const [tempPeriodo, setTempPeriodo] = useState(periodo);
  const [tempComentarios, setTempComentarios] = useState(comentarios);

  // Reset temporary state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempStatus(status);
      setTempNota(nota);
      setTempPeriodo(periodo);
      setTempComentarios(comentarios);
    }
  }, [isOpen, status, nota, periodo, comentarios]);

  const handleSave = () => {
    onSave(tempStatus, tempNota, tempPeriodo, tempComentarios);
    onClose();
  };

  const handleClose = () => {
    // Reset temporary state when closing without saving
    setTempStatus(status);
    setTempNota(nota);
    setTempPeriodo(periodo);
    setTempComentarios(comentarios);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Portal>
        {isOpen && (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              width="100vw"
              height="100vh"
              bg="rgba(0, 0, 0, 0.4)"
              backdropFilter="blur(4px)"
              zIndex={4}
              onClick={handleClose}
            />

            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              borderRadius="sm"
              boxShadow="dark-lg"
              p={6}
              width="800px"
              zIndex={5}
              bgGradient="linear(to-br, white, gray.50)"
              letterSpacing="wide"
              lineHeight="1.6"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                aria-label="Cerrar modal"
                onClick={handleClose}
                position="absolute"
                top={2}
                right={2}
                size="xs"
                rounded="sm"
              >
                <IoClose />
              </IconButton>

              <Box mt={8} px={4} py={2}>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  mb={10}
                  textAlign="center"
                >
                  {data.label}
                </Text>
                <DataGrid
                  data={data}
                  status={tempStatus}
                  setStatus={setTempStatus}
                  nota={tempNota}
                  setNota={setTempNota}
                  periodo={tempPeriodo}
                  setPeriodo={setTempPeriodo}
                  comentarios={tempComentarios}
                  setComentarios={setTempComentarios}
                />
                <Box mt={6} display="flex" justifyContent="flex-end">
                  <Button colorScheme="blue" onClick={handleSave}>
                    Guardar
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Portal>
    </>
  );
}

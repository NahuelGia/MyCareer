import { Box, Heading, Button } from '@chakra-ui/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteProgress: () => void;
}

export const SettingsModal = ({ isOpen, onClose, onDeleteProgress }: SettingsModalProps) => {
  if (!isOpen) return null;

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
        maxW="400px"
        w="100%"
        onClick={e => e.stopPropagation()}
      >
        <Heading size="md" mb={4} textAlign="center">Ajustes</Heading>
        <Button
          colorScheme="red"
          w="100%"
          onClick={onDeleteProgress}
        >
          Borrar progreso
        </Button>
      </Box>
    </Box>
  );
}; 
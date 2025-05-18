import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { Button, Text } from "@chakra-ui/react";

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profileName: string;
}

export const DeleteProfileModal = ({
  isOpen,
  onClose,
  onConfirm,
  profileName,
}: DeleteProfileModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="rgba(0,0,0,0.7)" />
      <ModalContent
        position="relative"
        zIndex={1401}
        maxW="500px"
        mx="auto"
        my="auto"
        mt="10vh"
        bg="white"
        backgroundColor="#fff"
        background="#fff"
        style={{ backgroundColor: "#fff", background: "#fff", opacity: 1 }}
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="2xl"
        p="14px"
      >
        <ModalCloseButton position="absolute" right="14px" top="14px" />
        <ModalHeader pt="0" pb="14px" bg="white" alignSelf="center">
          Eliminar Perfil
        </ModalHeader>
        <ModalBody bg="white">
          <Text my="14px">
            ¿Estás seguro que deseas eliminar el perfil "{profileName}"?
          </Text>
        </ModalBody>
        <ModalFooter bg="white">
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

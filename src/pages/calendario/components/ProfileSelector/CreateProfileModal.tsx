import { Button, Input } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useState } from "react";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string) => void;
}

export const CreateProfileModal = ({
  isOpen,
  onClose,
  onCreateProfile,
}: CreateProfileModalProps) => {
  const [profileName, setProfileName] = useState("");

  const handleSubmit = () => {
    if (profileName.trim()) {
      onCreateProfile(profileName.trim());
      setProfileName("");
      onClose();
    }
  };

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
          Crear Nuevo Perfil
        </ModalHeader>
        <ModalBody bg="white">
          <FormControl>
            <FormLabel>Nombre del perfil</FormLabel>
            <Input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Ingrese el nombre del perfil"
              my="14px"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter bg="white">
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            disabled={!profileName.trim()}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { Select as ChakraSelect } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { CreateProfileModal } from "./CreateProfileModal";
import { DeleteProfileModal } from "./DeleteProfileModal";

interface Profile {
  id: string;
  name: string;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfile: string;
  onProfileChange: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (profileId: string) => void;
}

export const ProfileSelector = ({
  profiles,
  selectedProfile,
  onProfileChange,
  onCreateProfile,
  onDeleteProfile,
}: ProfileSelectorProps) => {
  const {
    open: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [profileToDelete, setProfileToDelete] = useState<string>("");
  const toast = useToast();

  const handleDeleteClick = (profileId: string) => {
    setProfileToDelete(profileId);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    onDeleteProfile(profileToDelete);
    onDeleteClose();
    toast({
      title: "Perfil eliminado",
      description: "El perfil ha sido eliminado exitosamente",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box mb={4} pl={3}>
      <Flex gap={4} align="center">
        <ChakraSelect
          value={selectedProfile}
          onChange={(e: any) => onProfileChange(e.target.value)}
          width="300px"
          iconColor="transparent"
          fontFamily="Inter, sans-serif"
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </ChakraSelect>

        <Button colorScheme="blue" onClick={onCreateOpen}>
          Nuevo Perfil
        </Button>

        <Button
          colorScheme="red"
          onClick={() => handleDeleteClick(selectedProfile)}
          disabled={profiles.length <= 1}
        >
          Eliminar Perfil
        </Button>
      </Flex>

      <CreateProfileModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onCreateProfile={onCreateProfile}
      />

      <DeleteProfileModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        profileName={profiles.find((p) => p.id === profileToDelete)?.name || ""}
      />
    </Box>
  );
};

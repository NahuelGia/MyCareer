import { Box, Flex, Text, Link, Spinner, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useLocation, useParams } from "react-router";
import { useSubjects } from "../context/SubjectsContext";
import { ProfileButton } from "./ProfileButton";
import { useSubjectsActions } from "../hooks/useSubjectsActions";
import Check from "./images/check.svg";
import Save from "./images/save.svg";
import React, { useState } from "react";
import { Select as ChakraSelect } from "@chakra-ui/select";
import { Popover } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CreateProfileModal } from "../pages/calendario/components/ProfileSelector/CreateProfileModal";
import { DeleteProfileModal } from "../pages/calendario/components/ProfileSelector/DeleteProfileModal";
import { CalendarProfile } from "../pages/calendario/utils/storage";

interface NavbarProps {
  customTitle?: string;
  profiles?: CalendarProfile[];
  selectedProfile?: string;
  onProfileChange?: (profileId: string) => void;
  onCreateProfile?: (name: string) => void;
  onDeleteProfile?: (profileId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  customTitle,
  profiles,
  selectedProfile,
  onProfileChange,
  onCreateProfile,
  onDeleteProfile,
}) => {
  const location = useLocation();
  const { id } = useParams();
  const { subjectsData } = useSubjects();
  const { isSaving, saved } = useSubjectsActions();

  let screenDescription = "Home";

  if (location.pathname === "/") {
    screenDescription = "Selector de Carrera";
  } else if (location.pathname === "/creator") {
    screenDescription = "Creador de Carrera";
  } else if (id) {
    const career = subjectsData.find((c) => c.id === id);
    if (career) {
      screenDescription = career.nombre;
    } else {
      screenDescription = "Carrera";
    }
  }

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState("");
  const toast = useToast();

  const handleProfileChangeLocal = (e: any) => {
    onProfileChange && onProfileChange(e.target.value);
  };
  const handleCreateProfileLocal = (name: string) => {
    onCreateProfile && onCreateProfile(name);
    setCreateOpen(false);
    toast({
      title: "Perfil creado",
      description: `Se creó el perfil '${name}' exitosamente`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const handleDeleteClick = (profileId: string) => {
    setProfileToDelete(profileId);
    setDeleteOpen(true);
  };
  const handleDeleteProfileLocal = (profileId: string) => {
    onDeleteProfile && onDeleteProfile(profileId);
    setDeleteOpen(false);
    toast({
      title: "Perfil eliminado",
      description: "El perfil ha sido eliminado exitosamente",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="10"
      width="100%"
      py={3}
      px={6}
      bg="white"
      boxShadow="md"
    >
      <Flex justify="space-between" align="center">
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <Text fontWeight="bold" fontSize="xl" color="blue.600">
            MyCareer
          </Text>
        </Link>

        <Text fontWeight="medium" fontSize="md">
          {customTitle || screenDescription}
        </Text>

        <Flex align="center">
          {isSaving && (
            <Flex flexDirection="row" gap={2} marginRight={2}>
              <img
                src={Save}
                className={"max-h-[30px] min-h-[30px] self-start"}
              />
              <Spinner size="sm" color="#000000" />
            </Flex>
          )}

          {!isSaving && saved && (
            <Flex flexDirection="row" gap={2} marginRight={2}>
              <img
                src={Save}
                className={"max-h-[30px] min-h-[30px] self-start"}
              />
              <img
                src={Check}
                className={"max-h-[30px] min-h-[30px] self-start"}
              />
            </Flex>
          )}
          {location.pathname.includes("calendar") &&
            profiles &&
            selectedProfile &&
            onProfileChange &&
            onCreateProfile &&
            onDeleteProfile && (
              <Popover.Root positioning={{ placement: "bottom-end" }}>
                <Popover.Trigger>
                  <Button variant="outline" mr={4}>
                    Seleccionar perfil
                  </Button>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.CloseTrigger />
                    <Popover.Body border={"1px solid"} borderColor="gray.200">
                      <Flex
                        direction="column"
                        align="stretch"
                        gap={3}
                        width="100%"
                      >
                        <Box width="100%">
                          <ChakraSelect
                            value={selectedProfile}
                            onChange={handleProfileChangeLocal}
                            width="100%"
                            fontFamily="Inter, sans-serif"
                            iconColor="transparent"
                          >
                            {profiles.map((profile) => (
                              <option key={profile.id} value={profile.id}>
                                {profile.name}
                              </option>
                            ))}
                          </ChakraSelect>
                        </Box>
                        <Button
                          colorScheme="blue"
                          width="100%"
                          onClick={() => setCreateOpen(true)}
                        >
                          Nuevo Perfil
                        </Button>
                        <Button
                          colorScheme="red"
                          width="100%"
                          onClick={() => handleDeleteClick(selectedProfile)}
                          disabled={profiles.length <= 1}
                        >
                          Eliminar Perfil
                        </Button>
                      </Flex>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            )}
          <CreateProfileModal
            isOpen={isCreateOpen}
            onClose={() => setCreateOpen(false)}
            onCreateProfile={handleCreateProfileLocal}
          />
          <DeleteProfileModal
            isOpen={isDeleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={() => handleDeleteProfileLocal(profileToDelete)}
            profileName={
              profiles?.find((p) => p.id === profileToDelete)?.name || ""
            }
          />
          <ProfileButton />
        </Flex>
      </Flex>
    </Box>
  );
};

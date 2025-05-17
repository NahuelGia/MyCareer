import { Box, Flex, Text, Link, Spinner } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router";
import { useSubjects } from "../context/SubjectsContext";
import { ProfileButton } from "./ProfileButton";
import { useSubjectsActions } from "../hooks/useSubjectsActions";
import Check from "./images/check.svg";
import Save from "./images/save.svg";

interface NavbarProps {
  customTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ customTitle }) => {
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
          <ProfileButton />
        </Flex>
      </Flex>
    </Box>
  );
};

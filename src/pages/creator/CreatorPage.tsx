import { Box, Container, Center, Flex } from "@chakra-ui/react";
import { SubjectTreeEditorWrapper } from "./components/SubjectTreeEditor";
import { Navbar } from "../../components/Navbar";

export const CreatorPage = () => {
  return (
    <Flex minH="100vh" direction="column">
      <Navbar />
      <Container maxW="container.lg" py={10} flex="1">
        <Center>
          <Box w="full" h="800px" bg="gray.50" borderRadius="md" p={4}>
            <SubjectTreeEditorWrapper />
          </Box>
        </Center>
      </Container>
    </Flex>
  );
};

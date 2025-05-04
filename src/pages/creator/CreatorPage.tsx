import { Box, Container, Center, Flex } from "@chakra-ui/react";
import { SubjectTreeEditorWrapper } from "./components/SubjectTreeEditor";

export const CreatorPage = () => {
  return (
    <Flex minH="100vh" direction="column" justify="center">
      <Container maxW="container.lg" py={10}>
        <Center>
          <Box w="full" h="800px" bg="gray.50" borderRadius="md" p={4}>
            <SubjectTreeEditorWrapper />
          </Box>
        </Center>
      </Container>
    </Flex>
  );
};

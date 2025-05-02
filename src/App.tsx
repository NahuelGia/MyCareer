import { Box, Text, VStack, Heading, Container, Center, Flex } from "@chakra-ui/react";
import { carreras } from "./pages/materias/utils/jsonDbs";
import { useSubjects } from "./context/SubjectsContext";
import { CareerCard } from "./components/CareerCard";
import { useEffect } from "react";

export default function Page() {
	const { subjectsData, isLoading, loadCareersProgress } = useSubjects();

	useEffect(() => {
		loadCareersProgress();
	}, []);

	if (isLoading) {
		return (
			<Center h="100vh">
				<VStack gap="2">
					<Heading size="7xl" color="blue.600">
						MyCareer
					</Heading>
					<Text>Cargando carreras...</Text>
				</VStack>
			</Center>
		);
	}

	return (
		<Flex minH="100vh" direction="column" justify="center">
			<Container maxW="container.lg" py={20}>
				<Center>
					<VStack gap={8} align="center">
						<VStack gap={2} align="center">
							<Heading size="7xl" color="blue.600" textAlign="center">
								MyCareer
							</Heading>
							<Text fontSize="2xl" color="gray.600" textAlign="center">
								Tu progreso académico en un solo lugar
							</Text>
						</VStack>

						<VStack gap={4} width="full" maxW="600px" align="center">
							{carreras.map((carrera) => {
								const careerProgress = subjectsData.find(c => c.id === carrera.id);
								return (
									<CareerCard 
										key={carrera.id} 
										carrera={carrera} 
										careerProgress={careerProgress} 
									/>
								);
							})}
						</VStack>
					</VStack>
				</Center>
			</Container>
		</Flex>
	);
}

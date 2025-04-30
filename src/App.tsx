import { Box, ClientOnly, Skeleton, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ColorModeToggle } from "./components/color-mode-toggle";
import { Link } from "react-router";
import { carreras } from "./pages/materias/utils/jsonDbs";

export default function Page() {
	return (
		<Box textAlign="center" fontSize="xl" pt="30vh">
			<VStack gap="8">
				<img alt="MyCareer logo" src="/static/logo.png" width="800"/>
				{
					carreras.map((carrera) => (
						<Button key={carrera.id}>
							<Link to={`/${carrera.id}`}>{carrera.nombre}</Link>
						</Button>
					))
				}
			</VStack>

			<Box pos="absolute" top="4" right="4">
				<ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
					<ColorModeToggle />
				</ClientOnly>
			</Box>
		</Box>
	);
}

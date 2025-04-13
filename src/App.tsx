import { Box, ClientOnly, Skeleton, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ColorModeToggle } from "./components/color-mode-toggle";

export default function Page() {
	return (
		<Box textAlign="center" fontSize="xl" pt="30vh">
			<VStack gap="8">
				<img alt="MyCareer logo" src="/static/logo.png" width="800"/>

				<Button>
					<a href="/materias">Arbol de materias</a>
				</Button>
			</VStack>

			<Box pos="absolute" top="4" right="4">
				<ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
					<ColorModeToggle />
				</ClientOnly>
			</Box>
		</Box>
	);
}

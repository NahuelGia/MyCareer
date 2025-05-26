// SavingIndicator.tsx
import {Box, Flex, Text} from "@chakra-ui/react";
import {useMemo} from "react";

import {Tooltip} from "@/components/ui/tooltip";

interface SavingIndicatorProps {
	isSaving: boolean;
	saved: boolean;
	lastTime: string | null; // ISO string
	error?: boolean;
}

export const SavingIndicator: React.FC<SavingIndicatorProps> = ({
	isSaving,
	saved,
	lastTime,
	error = false,
}) => {
	const statusText = useMemo(() => {
		if (error) return "Error al guardar";
		if (isSaving) return "Guardando...";
		if (saved) return "Guardado";
		return "Sin guardar";
	}, [isSaving, saved, error]);

	const color = useMemo(() => {
		if (error) return "red.400";
		if (isSaving) return "yellow.400";
		if (saved) return "green.400";
		return "gray.400";
	}, [isSaving, saved, error]);

	const formattedTime = useMemo(() => {
		if (!lastTime) return "";
		const date = new Date(lastTime);
		return date.toLocaleString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}, [lastTime]);

	return (
		<Tooltip
			label={
				error
					? "Hubo un problema al guardar"
					: lastTime
					? `Último guardado: ${formattedTime}`
					: "Aún no se ha guardado"
			}
			placement="bottom-start"
			hasArrow
			bg="gray.700"
			color="white"
			fontSize="xs"
			p={2}
			borderRadius="md"
		>
			<Flex align="center" gap={2}>
				<Box
					w={2}
					h={2}
					borderRadius="full"
					bg={color}
					transition="background-color 0.3s ease"
				/>
				<Text fontSize="sm" color="gray.600" fontWeight="medium">
					{statusText}
				</Text>
			</Flex>
		</Tooltip>
	);
};

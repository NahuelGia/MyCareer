import {HStack, Progress, Text} from "@chakra-ui/react";

interface AcademicProgressBarProps {
	approved: number;
	total: number;
}

export const AcademicProgressBar = ({
	approved,
	total,
}: AcademicProgressBarProps) => {
	const percent = total > 0 ? Math.round((approved / total) * 100) : 0;

	return (
		<Progress.Root value={percent} size="lg" w="100%" colorPalette="green">
			<HStack gap="5" w="100%">
				<Progress.Label>Progreso académico:</Progress.Label>
				<Progress.Track flex="1">
					<Progress.Range />
				</Progress.Track>
				<Progress.ValueText>{percent}%</Progress.ValueText>
				<Text color="gray.500">
					({approved} / {total} materias)
				</Text>
			</HStack>
		</Progress.Root>
	);
};

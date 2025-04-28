import {
	Box,
	Flex,
	Grid,
	GridItem,
	IconButton,
	Span,
	Text,
} from "@chakra-ui/react";
import {IoClose} from "react-icons/io5";
import {Selector} from "./CustomNode/Selector";

export default function ModalMateria({
	isOpen,
	data,
	onClose,
	setStatus,
	status,
}: {
	isOpen: boolean;
	data: {
		label: string;
		status: string;
		prerequisites?: any;
		credits?: number;
		weeklyHours: number;
		degreeModule: string;
	};
	status: string;
	onClose: () => void;
	setStatus: (newStatus: string) => void;
}) {
	if (!isOpen) return null;

	return (
		<>
			{/* Contenido del modal */}
			{isOpen && (
				<Box
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					bg="white"
					borderRadius="sm"
					boxShadow="dark-lg"
					p={6}
					width="400px"
					zIndex={5}
					bgGradient="linear(to-br, white, gray.50)"
					letterSpacing="wide"
					lineHeight="1.6"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Botón para cerrar el modal */}
					<IconButton
						aria-label="Cerrar modal"
						onClick={onClose}
						position="absolute"
						top={2}
						right={2}
						size="xs"
						rounded="sm"
					>
						<IoClose />
					</IconButton>

					{/* Información de la materia */}
					<Box mt={8}>
						<Text fontSize="xl" fontWeight="bold" mb={2} textAlign="center">
							{data.label}
						</Text>

						<Grid templateColumns="150px 1fr" rowGap={4} columnGap={4}>
							<Label>Estado:</Label>
							<Value>
								<Flex alignItems="center" justifyContent="center" flexWrap="nowrap" gap={2}>
									<Text whiteSpace="nowrap">{status}</Text>
									<Selector
										onChangeStatus={(newStatus) => setStatus(newStatus)}
										status={status}
									/>
								</Flex>
							</Value>

							<Label>Créditos:</Label>
							<Value>{data.credits ?? "No disponible"}</Value>

							<Label>Horas semanales:</Label>
							<Value>{data.weeklyHours ?? "No disponible"}</Value>

							<Label>Módulo:</Label>
							<Value>{data.degreeModule ?? "No disponible"}</Value>

							<Label>Prerrequisitos:</Label>
							<Value>
								{data.prerequisites && data.prerequisites.length > 0
									? data.prerequisites.join(", ")
									: "Ninguno"}
							</Value>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

const Label = ({children}: {children: React.ReactNode}) => (
	<GridItem>
		<Text fontWeight="medium">{children}</Text>
	</GridItem>
);

const Value = ({children}: {children: React.ReactNode}) => (
	<GridItem>
		<Text fontFamily={"mono"}>{children}</Text>
	</GridItem>
);

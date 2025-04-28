import {
	Box,
	Flex,
	Grid,
	GridItem,
	IconButton,
	Input,
	Text,
	Textarea,
} from "@chakra-ui/react";
import {IoClose} from "react-icons/io5";
import {Selector} from "../AcademicTree/CustomNode/Selector";
import {useState} from "react";
import {ExpandableText} from "./ExpandableText";

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
	const [nota, setNota] = useState("");
	const [periodo, setPeriodo] = useState("");

	const [touched, setTouched] = useState(false);

	const isInvalid = touched && !/^[12]-\d{4}$/.test(periodo);

	if (!isOpen) return null;

	return (
		<>
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
					width="800px"
					zIndex={5}
					bgGradient="linear(to-br, white, gray.50)"
					letterSpacing="wide"
					lineHeight="1.6"
					onClick={(e) => e.stopPropagation()}
				>
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

					<Box mt={8} px={4} py={2}>
						<Text fontSize="3xl" fontWeight="bold" mb={10} textAlign="center">
							{data.label}
						</Text>
						<Flex gap={4} align={"start"} justify="center">
							<Grid
								templateColumns="150px 1fr 150px 1fr"
								rowGap={4}
								columnGap={8}
								width="100%"
							>
								<Label>Estado:</Label>
								<Value>
									<Flex alignItems="center" gap={2}>
										<Text whiteSpace="nowrap">{status}</Text>
										<Selector
											onChangeStatus={(newStatus) => setStatus(newStatus)}
											status={status}
										/>
									</Flex>
								</Value>

								<Label>Prerrequisitos:</Label>
								<Value>
									{data.prerequisites && data.prerequisites.length > 0 ? (
										<ExpandableText text={data.prerequisites.join(", ")} />
									) : (
										"Ninguno"
									)}
								</Value>

								<Label>Créditos:</Label>
								<Value>{data.credits ?? "No disponible"}</Value>

								<Label>Nota:</Label>
								<Value>
									<Input
										variant={"subtle"}
										value={nota}
										onChange={(e) => setNota(e.target.value)}
										placeholder="Ejemplo: 8"
										type="number"
										min="0"
										max="10"
										disabled={status !== "Completada"}
									/>
								</Value>

								<Label>Horas semanales:</Label>
								<Value>{data.weeklyHours ?? "No disponible"}</Value>

								<Label>Periodo:</Label>
								<Value>
									<Box>
										<Input
											variant="subtle"
											value={periodo}
											onChange={(e) => setPeriodo(e.target.value)}
											onBlur={() => setTouched(true)}
											placeholder="1-2025"
											type="text"
											disabled={status === "Pendiente"}
										/>
										{isInvalid && (
											<Text color="red.500" fontSize="sm" mt={1}>
												El formato debe ser: Cuatrimestre-Año
											</Text>
										)}
									</Box>
								</Value>

								<Label>Módulo:</Label>
								<Value>
									<Text whiteSpace="nowrap">
										{data.degreeModule ?? "No disponible"}
									</Text>
								</Value>

								<Label>Comentarios:</Label>
								<Value>
									<Textarea name="notes" size={"xs"} />
								</Value>
							</Grid>
						</Flex>
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

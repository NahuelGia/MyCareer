import {useState} from "react";
import {
	Box,
	Input,
	Text,
	Textarea,
	Grid,
	Flex,
	GridItem,
} from "@chakra-ui/react";
import {Selector} from "../AcademicTree/CustomNode/Selector";
import {ExpandableText} from "./ExpandableText";
import {getNodeColor} from "../../helper/TreeChatHelper";

interface MateriaData {
	label: string;
	status: string;
	prerequisites?: any;
	credits?: number;
	weeklyHours: number;
	degreeModule: string;
}

export default function DataGrid({
	data,
	setStatus,
	status,
	nota,
	setNota,
	periodo,
	setPeriodo,
	comentarios,
	setComentarios,
}: {
	status: string;
	setStatus: (newStatus: string) => void;
	data: MateriaData;
	nota: string;
	setNota: (value: string) => void;
	periodo: string;
	setPeriodo: (value: string) => void;
	comentarios: string;
	setComentarios: (value: string) => void;
}) {
	const [touched, setTouched] = useState(false);
	const isInvalid = touched && !/^[12]-\d{4}$/.test(periodo);

	return (
		<Flex gap={4} align={"start"} justify="center" direction="column">
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
							currentStatus={status}
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
			</Grid>
			<Box w="100%">
				<Text mb={3} mt={4} fontWeight="medium">
					{"Comentarios:"}
				</Text>
				<Textarea
					placeholder="Escribe aquí tus comentarios..."
					size="md"
					resize="none"
					minW={"100%"}
					minH="120px"
					p={3}
					borderRadius="md"
					borderColor="gray.300"
					_focus={{
						borderColor: "blue.400",
						boxShadow: "0 0 0 1px #63b3ed",
					}}
					_selection={{
						backgroundColor: "blue.400",
						color: "white",
					}}
					bg={getNodeColor(status)}
					value={comentarios}
					onChange={(e) => setComentarios(e.target.value)}
				/>
			</Box>
		</Flex>
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

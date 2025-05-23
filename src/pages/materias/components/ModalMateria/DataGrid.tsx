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
import {Selector} from "./Selector";
import {ExpandableText} from "./ExpandableText";
import {getNodeColor} from "../../helper/TreeChatHelper";
import {DateSelector} from "./DateSelector";

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
	periodo: {cuatrimestre: string};
	setPeriodo: (value: {cuatrimestre: string}) => void;

	comentarios: string;
	setComentarios: (value: string) => void;
}) {
	const [touched, setTouched] = useState(false);
	const isInvalid = touched && !/^[12]-\d{4}$/.test(periodo);
	const [año, setAño] = useState<string>("");
	const currentYear = new Date().getFullYear();

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

				<Label>Cuatrimestre:</Label>
				<Value>
					<Flex gap={2} alignItems="center" justifyContent="space-between">
						<Text whiteSpace="nowrap">{periodo.cuatrimestre}</Text>
						<DateSelector
							onChangeStatus={(newStatus) => setPeriodo(newStatus)}
							currentCuatrimestre={periodo.cuatrimestre}
							disabled={status !== "Completada"}
						/>
					</Flex>
				</Value>

				<Label>Módulo:</Label>
				<Value>
					<Text whiteSpace="nowrap">
						{data.degreeModule ?? "No disponible"}
					</Text>
				</Value>

				<Label>Año:</Label>
				<Value>
					<Flex gap={2} alignItems="center" justifyContent="space-between">
						<Input
							variant={"subtle"}
							value={año}
							onChange={(e) => setAño(e.target.value)}
							placeholder="Ejemplo: `${currentYear}`"
							type="number"
							min="0"
							max="10"
							disabled={status !== "Completada"}
						/>
					</Flex>
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
		<Text>{children}</Text>
	</GridItem>
);

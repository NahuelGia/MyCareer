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
		<Flex
			gap={4}
			align={"start"}
			justify="center"
			direction="column"
			minW="600px"
		>
			<Grid
				templateColumns="150px 1fr 150px 1fr"
				rowGap={4}
				columnGap={8}
				width="100%"
			>
				<Label>Estado:</Label>

				<Value>
					<Flex
						gap={4}
						alignItems="center"
						justifyContent="space-between"
						bg="#f4f4f5"
						borderRadius="md"
						p={3}
						borderColor="gray.300"
						borderWidth={1}
						minW="200px"
					>
						<Text whiteSpace="nowrap" flex="1" textAlign="left">
							{status}
						</Text>

						<Box ml={4} flexShrink={0}>
							<Selector
								onChangeStatus={(newStatus) => setStatus(newStatus)}
								currentStatus={status}
							/>
						</Box>
					</Flex>
				</Value>

				<Label>Créditos:</Label>
				<Value>{data.credits ?? "No disponible"}</Value>

				<Label>Nota:</Label>
				<Value>
					<Input
						borderRadius={"md"}
						borderColor="gray.300"
						variant={"subtle"}
						value={nota}
						size={"lg"}
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
					<Flex
						gap={2}
						alignItems="center"
						justifyContent="space-between"
						borderRadius="md"
						bg={status === "Pendiente" ? "#f9f9fa" : "#f4f4f5"}
						p={2}
						borderColor={status === "Pendiente" ? "gray.200" : "gray.300"}
						borderWidth={1}
						opacity={status === "Pendiente" ? 0.7 : 1}
						_hover={{
							cursor: status === "Pendiente" ? "not-allowed" : "pointer",
						}}
					>
						<Text
							whiteSpace="nowrap"
							color={status === "Pendiente" ? "gray.500" : "inherit"}
						>
							{periodo.cuatrimestre || "No aplica"}
						</Text>
						<DateSelector
							onChangeStatus={(newStatus) => setPeriodo(newStatus)}
							currentCuatrimestre={periodo.cuatrimestre}
							disabled={status === "Pendiente"}
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
							borderRadius={"md"}
							borderColor="gray.300"
							variant={"subtle"}
							value={año}
							size={"lg"}
							onChange={(e) => setAño(e.target.value)}
							placeholder={`Ejemplo: ${currentYear}`}
							type="number"
							min="2000"
							max={currentYear}
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
					borderRadius={"md"}
					borderColor="gray.300"
					placeholder="Escribe aquí tus comentarios..."
					size="md"
					resize="none"
					minW={"100%"}
					minH="120px"
					p={3}
					_focus={{
						borderColor: "blue.400",
						boxShadow: "0 0 0 1px #63b3ed",
					}}
					_selection={{
						backgroundColor: "blue.400",
						color: "white",
					}}
					bg={"gray.300"}
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

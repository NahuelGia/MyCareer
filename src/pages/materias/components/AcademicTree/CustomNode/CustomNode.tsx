import {memo, useState} from "react";
import {Handle, Position} from "@xyflow/react";
import {Box, Center, Flex, Text} from "@chakra-ui/react";
import {getNodeColor} from "../../../helper/TreeChatHelper";
import {Selector} from "./Selector";
import {DegreeModule} from "../../../../../types/enums/degreeModule";
import {useSubjectsActions} from "../../../../../hooks/useSubjectsActions";
import {PrerequisitesDialog} from "./PrerequisitesDialog";
import ModalMateria from "../../ModalMateria/ModalMateria";
import { useSubjects } from "../../../../../context/SubjectsContext";

const CustomNode = ({
	id,
	data,
	sourcePosition,
	targetPosition,
}: {
	id: string;
	data: any;
	sourcePosition?: Position;
	targetPosition?: Position;
}) => {
	const {updateSubjectStatus} = useSubjectsActions();
	const {subjectsData} = useSubjects();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [pendingStatus, setPendingStatus] = useState<string>("");
	const [pendingPrerequisites, setPendingPrerequisites] = useState<string[]>(
		[]
	);
	const [status, setStatus] = useState(data.status);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [nota, setNota] = useState(data.nota);
	const [periodo, setPeriodo] = useState(data.periodo);
	const [comentarios, setComentarios] = useState(data.comentarios);

	const currentSubject = subjectsData?.materias.find((m) => m.id === id);
	const currentData = currentSubject?.data || data;

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if ((e.target as HTMLElement).closest(".selector-wrapper")) return;
		setIsModalOpen(true);
	};

	const handleStatusChange = async (newStatus: string) => {
		const prerequisites = currentData.prerequisites || [];
		const incompletePrerequisites = prerequisites.filter((prereq: string) => {
			const prerequisiteSubject = subjectsData?.materias.find(
				(m) => m.data.label === prereq
			);
			return (
				!prerequisiteSubject || prerequisiteSubject.data.status !== "Completada"
			);
		});

		if (incompletePrerequisites.length > 0) {
			setPendingStatus(newStatus);
			setPendingPrerequisites(incompletePrerequisites);
			setIsDialogOpen(true);
			return;
		}

		await updateSubjectStatus(id, newStatus);
	};

	const handleConfirm = async () => {
		await updateSubjectStatus(id, pendingStatus);
		setIsDialogOpen(false);
	};

	const handleOpenChange = (e: {open: boolean}) => {
		setIsDialogOpen(e.open);
	};

	const degree = currentData.degreeModule;
	return (
		<>
			<Box
				bg={
					currentData.available ? getNodeColor(currentData.status) : "gray.300"
				}
				borderWidth={degree == DegreeModule.COMPLEMENTARIO ? "1.5px" : "1px"}
				borderColor={
					degree == DegreeModule.COMPLEMENTARIO ? "red.400" : "gray.800"
				}
				borderStyle={degree == DegreeModule.COMPLEMENTARIO ? "dashed" : "solid"}
				borderRadius="md"
				minW={"8rem"}
				minH={"4rem"}
				p={1}
				color="black"
				boxShadow="none"
				position="relative"
				transition="all 0.2s ease-in-out"
				onClick={(e) => handleClick(e)}
				_hover={{
					transform: "scale(1.05)",
					boxShadow: "md",
				}}
			>
				{targetPosition && <Handle type="target" position={targetPosition} />}

				<Center minH={"4rem"} minW="8rem">
					<Flex
						direction="row"
						alignItems="center"
						justify="space-evenly"
						w="100%"
						h="100%"
					>
						<Flex direction="column" justify="center">
							<Text
								maxWidth="6rem"
								textStyle="xs"
								wordBreak="break-word"
								textAlign="center"
							>
								{data.label}
							</Text>
						</Flex>

						<Flex
							align="center"
							justify="center"
							h="100%"
							className="selector-wrapper"
						>
							{currentData.available && (
								<Flex align="center" justify="center" h="100%">
									<Selector
										onChangeStatus={handleStatusChange}
										currentStatus={currentData.status}
									/>
								</Flex>
							)}
						</Flex>
					</Flex>
				</Center>

				{sourcePosition && <Handle type="source" position={sourcePosition} />}

				<ModalMateria
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					data={data}
					status={status}
					setStatus={setStatus}
					nota={nota}
					setNota={setNota}
					periodo={periodo}
					setPeriodo={setPeriodo}
					comentarios={comentarios}
					setComentarios={setComentarios}
				/>
			</Box>
			<PrerequisitesDialog
				isOpen={isDialogOpen}
				onOpenChange={handleOpenChange}
				pendingPrerequisites={pendingPrerequisites}
				onConfirm={handleConfirm}
			/>
		</>
	);
};

export default memo(CustomNode);

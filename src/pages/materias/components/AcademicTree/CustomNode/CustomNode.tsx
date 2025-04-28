import {memo, useState} from "react";
import {Handle, Position} from "@xyflow/react";
import {Box, Center, Flex, Text} from "@chakra-ui/react";
import {getNodeColor} from "../../../helper/TreeChatHelper";
import {Selector} from "./Selector";
import {DegreeModule} from "../../../../../types/enums/degreeModule";
import ModalMateria from "../../ModalMateria/ModalMateria";

const CustomNode = ({
	data,
	sourcePosition,
	targetPosition,
}: {
	data: any;
	sourcePosition?: Position;
	targetPosition?: Position;
}) => {
	const [status, setStatus] = useState(data.status);
	const [nota, setNota] = useState("");
	const [periodo, setPeriodo] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if ((e.target as HTMLElement).closest(".selector-wrapper")) return;
		setIsModalOpen(true);
	};

	const degree = data.degreeModule;

	return (
		<>
			<Box
				bg={getNodeColor(status)}
				borderWidth={degree === DegreeModule.COMPLEMENTARIO ? "1.5px" : "1px"}
				borderColor={
					degree === DegreeModule.COMPLEMENTARIO ? "red.400" : "gray.800"
				}
				borderStyle={
					degree === DegreeModule.COMPLEMENTARIO ? "dashed" : "solid"
				}
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
							<Selector
								onChangeStatus={(newStatus) => setStatus(newStatus)}
								status={status}
							/>
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
				/>
			</Box>
		</>
	);
};

export default memo(CustomNode);

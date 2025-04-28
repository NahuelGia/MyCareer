import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { getNodeColor } from "../../../helper/TreeChatHelper";
import { Selector } from "./Selector";
import { DegreeModule } from "../../../../../types/enums/degreeModule";
import { useSubjectsActions } from "../../../../../hooks/useSubjectsActions";

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
	const { updateSubjectStatus } = useSubjectsActions();
	const [status, setStatus] = useState(data.status);

	const handleStatusChange = async (newStatus: string) => {
		setStatus(newStatus);
		await updateSubjectStatus(id, newStatus);
	};

	const degree = data.degreeModule;
	return (
		<Box
			bg={getNodeColor(status)}
			borderWidth={degree == DegreeModule.COMPLEMENTARIO ? "1.5px" : "1px"}
			borderColor={degree == DegreeModule.COMPLEMENTARIO ?  "red.400" : "gray.800"}
			borderStyle={degree == DegreeModule.COMPLEMENTARIO ? "dashed" : "solid"}
			borderRadius="md"
			minW={"8rem"}
			minH={"4rem"}
			p={1}
			color="black"
			boxShadow="none"
			position="relative"
			transition="all 0.2s ease-in-out"
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

					<Flex align="center" justify="center" h="100%">
						<Selector onChangeStatus={handleStatusChange} />
					</Flex>
				</Flex>
			</Center>

			{sourcePosition && <Handle type="source" position={sourcePosition} />}
		</Box>
	);
};

export default memo(CustomNode);

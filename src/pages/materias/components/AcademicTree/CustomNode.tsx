import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Text } from "@chakra-ui/react";
import { SubjectStates } from "../../utils/SubjectStates";
import { getNodeColor } from "../../helper/TreeChatHelper";

const CustomNode = ({
  data,
  sourcePosition,
  targetPosition,
}: {
  data: any;
  sourcePosition?: Position;
  targetPosition?: Position;
}) => {

  return (
    <Box
      bg={getNodeColor(data.status)}
      borderWidth="1px"
      borderColor="gray.800"
      borderRadius="md"
      width="9.5rem"
      p={3}
      color="black"
      boxShadow="none"
      position="relative"
      textAlign={"center"}
    >
      {targetPosition && <Handle type="target" position={targetPosition} />}

      <Text textStyle={"xs"}>{data.label}</Text>

      {sourcePosition && <Handle type="source" position={sourcePosition} />}
    </Box>
  );
};

export default memo(CustomNode);

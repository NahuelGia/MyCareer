import {useState} from "react";
import {Button, Flex, IconButton, Text} from "@chakra-ui/react";
import {FcCollapse, FcExpand} from "react-icons/fc";

export const ExpandableText = ({text}: {text: string}) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<Flex align="center" maxW="300px" position={"relative"}>
			<Text
				onClick={() => setExpanded(!expanded)}
				style={{
					display: "-webkit-box",
					WebkitBoxOrient: "vertical",
					WebkitLineClamp: expanded ? "none" : 2,
				}}
				overflow="hidden"
				whiteSpace="normal"
				textOverflow="ellipsis"
				transition="ease-in-out 0.2s"
				fontFamily="mono"
				cursor="pointer"
				lineHeight="short"
				maxWidth="100%"
				fontSize="sm"
			>
				{text}
			</Text>
		</Flex>
	);
};

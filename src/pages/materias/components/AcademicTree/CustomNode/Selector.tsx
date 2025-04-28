import {
	HStack,
	IconButton,
	Portal,
	Select,
	createListCollection,
	useSelectContext,
} from "@chakra-ui/react";
import {
	RiArrowDownSLine,
	RiCheckLine,
	RiLoader4Line,
	RiTimeLine,
} from "react-icons/ri";

interface SelectorProps {
	onChangeStatus: (status: string) => void;
	currentStatus: string;
}

const ButtonSelector = () => {
	const select = useSelectContext();
	const items = select.selectedItems as SubjectStatesInfo[];
	return (
		<IconButton
			variant="ghost"
			color={"black"}
			size="2xs"
			_hover={{bg: "#EEEE"}}
			_active={{bg: "#EEEE"}}
			_expanded={{bg: "#EEEE"}}
			height={"9/12"}
			{...select.getTriggerProps()}
		>
			<RiArrowDownSLine />
		</IconButton>
	);
};



export const Selector = ({ onChangeStatus, currentStatus }: SelectorProps) => {

return (
		<Select.Root
			positioning={{sameWidth: false}}
			collection={states}
			size="md"
			value={[currentStatus]}
			defaultValue={[currentStatus]}

			onValueChange={(value) => {
				onChangeStatus(value.value[0]);
			}}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<ButtonSelector />
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content
						minW="32"
						bg="white"
						color="#09090b"
						shadow={"sm"}
						onClick={(e) => e.stopPropagation()}
						className=".selector-wrapper"
					>
						{states.items.map((state) => (
							<Select.Item
								key={state.value}
								item={state}
								_selected={{
									bg: "#EEEE",
									color: "#09090b",
									fontWeight: "bold",
								}}
								_hover={{bg: "#EEEE", cursor: "pointer"}}
							>
								<HStack>
									{state.icon}
									{state.label}
								</HStack>
							</Select.Item>
						))}
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	);
};

const states = createListCollection({
	items: [
		{label: "Completada", value: "Completada", icon: <RiCheckLine />},
		{label: "Pendiente", value: "Pendiente", icon: <RiTimeLine />},
		{label: "En curso", value: "En curso", icon: <RiLoader4Line />},
	],
});

interface SubjectStatesInfo {
	label: string;
	value: string;
	icon: React.ReactNode;
}

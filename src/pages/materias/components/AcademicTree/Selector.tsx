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
	RiForbidLine,
	RiLoader4Line,
	RiTimeLine,
} from "react-icons/ri";

const ButtonSelector = () => {
	const select = useSelectContext();
	const items = select.selectedItems as SubjectStatesInfo[];
	return (
		<IconButton
			variant="ghost"
			color={"black"}
			size="2xs"
			_hover={{ bg: "#EEEE" }}
			_active={{ bg: "#EEEE" }}
			_expanded={{ bg: "#EEEE" }}
			height={"9/12"}
			{...select.getTriggerProps()}
		>
			<RiArrowDownSLine />
		</IconButton>
	);
};

export const Selector = () => {
	return (
		<Select.Root
			positioning={{ sameWidth: false }}
			collection={states}
			size="md"
			defaultValue={["Pendiente"]}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<ButtonSelector />
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content minW="32" bg="#EEEE" color="#09090b" shadow={"sm"}>
						{states.items.map((state) => (
							<Select.Item
								key={state.value}
								item={state}
								_selected={{ bg: "#FFFF", color: "#09090b", fontWeight: "bold" }}
								_hover={{ bg: "#FFFE", cursor: "pointer"}}

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
		{ label: "Completada", value: "react", icon: <RiCheckLine /> },
		{ label: "Pendiente", value: "vue", icon: <RiTimeLine /> },
		{ label: "En curso", value: "angular", icon: <RiLoader4Line /> },
	],
});

interface SubjectStatesInfo {
	label: string;
	value: string;
	icon: React.ReactNode;
}

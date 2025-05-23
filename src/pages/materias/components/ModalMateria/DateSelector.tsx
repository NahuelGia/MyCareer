import {
	Flex,
	HStack,
	IconButton,
	Portal,
	Select,
	createListCollection,
	useSelectContext,
} from "@chakra-ui/react";
import {useState} from "react";
import {RiArrowDownSLine} from "react-icons/ri";

// Subcomponente botón del selector
const ButtonSelector = () => {
	const select = useSelectContext();
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

const cuatrimestres = createListCollection({
	items: [
		{label: "1°", value: "1°"},
		{label: "2°", value: "2°"},
		{label: "Anual", value: "Anual"},
	],
});

interface DateSelectorProps {
	onChangeStatus: (value: {cuatrimestre: string}) => void;
	currentCuatrimestre: string;
	disabled: boolean;
}

export const DateSelector = ({
	onChangeStatus,
	currentCuatrimestre,
	disabled,
}: DateSelectorProps) => {
	const [cuatrimestre, setCuatrimestre] = useState(currentCuatrimestre);

	const handleChange = (newCuatri: string) => {
		onChangeStatus({cuatrimestre: newCuatri});
	};

	return (
		<Flex>
			{/* Cuatrimestre */}
			<Select.Root
				collection={cuatrimestres}
				value={[cuatrimestre]}
				onValueChange={(value) => {
					const newCuatri = value.value[0];
					setCuatrimestre(newCuatri);
					handleChange(newCuatri);
				}}
				disabled={disabled}
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
							shadow="sm"
							onClick={(e) => e.stopPropagation()}
						>
							{cuatrimestres.items.map((state) => (
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
									<HStack>{state.label}</HStack>
								</Select.Item>
							))}
						</Select.Content>
					</Select.Positioner>
				</Portal>
			</Select.Root>
		</Flex>
	);
};

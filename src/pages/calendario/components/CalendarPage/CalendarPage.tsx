import React, {useState, useEffect} from "react";
import {useDebounce} from "use-debounce";
import {motion, AnimatePresence} from "framer-motion";
import {
	Box,
	Button,
	HStack,
	VStack,
	Text,
	Heading,
	Flex,
	Container,
	Input,
} from "@chakra-ui/react";
import {RiArrowLeftLine} from "react-icons/ri";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useNavigate, useParams} from "react-router";
import {Navbar} from "../../../../components/Navbar";
import {useSubjects} from "../../../../context/SubjectsContext";
import {BasicCheckbox} from "../../../../components/Checkbox";
import tpiData from "../../utils/jsonDbs/tpi.json";
import {CalendarStorageService} from "../../../../services/storage/calendar-storage";
import {useUser} from "@/context/UserContext";
import {loadUserCalendarData, updateUserData} from "@/lib/supabaseClient";
import {CalendarStorage, CalendarProfile} from "../../utils/storage";
import {ProfileSelector} from "../ProfileSelector/ProfileSelector";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

interface CalendarEvent {
	title: string;
	daysOfWeek: string[];
	startTime: string;
	endTime: string;
	extendedProps: {
		comisiones: string[];
	};
	color?: string;
}

interface CalendarDisplayEvent extends Omit<CalendarEvent, "extendedProps"> {
	extendedProps: {
		comision: string;
		comisiones: string[];
	};
}

const STORAGE_KEY_PREFIX = "calendar_selections";

const careerCalendarData: Record<string, any> = {
	tpi: tpiData.data,
};

const generateUniqueColor = (text: string): string => {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360;
	const saturation = 70 + (Math.abs(hash) % 20);
	const lightness = 35 + (Math.abs(hash) % 25);
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const CalendarPage: React.FC = () => {
	const navigate = useNavigate();
	const {id} = useParams();
	const {user, isFetchingUser} = useUser();
	const {subjectsData, isLoading} = useSubjects();
	const [subjectEvents, setSubjectEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [profiles, setProfiles] = useState<CalendarProfile[]>([]);
	const [activeProfileId, setActiveProfileId] = useState<string>("");
	const [selections, setSelections] = useState<Record<string, boolean>>({});
	const [selectedComisiones, setSelectedComisiones] = useState<
		Record<string, string>
	>({});
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

	const getStorageKey = () => {
		if (!id) return STORAGE_KEY_PREFIX;
		return `${STORAGE_KEY_PREFIX}_${id}`;
	};

	useEffect(() => {
		if (!id) return;
		if (isFetchingUser) return;

		const loadData = async () => {
			try {
				const careerData = careerCalendarData[id] || tpiData.data;
				setSubjectEvents(careerData);
				const savedSelections = user
					? await loadUserCalendarData(user.id, getStorageKey())
					: localStorage.getItem(getStorageKey());
				if (savedSelections) {
					const parsed = user ? savedSelections : JSON.parse(savedSelections);
					setSelections(parsed.selections || {});
					setSelectedComisiones(parsed.selectedComisiones || {});
				} else {
					setSelections({});
					setSelectedComisiones({});
				}
				setLoading(false);
			} catch (error) {
				console.error(
					"Error loading calendar events or saved selections:",
					error
				);
				setLoading(false);
			}
		};

		loadData();
	}, [id, isFetchingUser]);

	useEffect(() => {
		if (!loading && id && !isFetchingUser) {
			const data = {
				selections,
				selectedComisiones,
			};

			if (user) {
				updateUserData(user.id, getStorageKey(), data);
			}
			localStorage.setItem(getStorageKey(), JSON.stringify(data));
		}
	}, [selections, selectedComisiones, loading, id]);

	useEffect(() => {
		if (!isFetchingUser && id) {
			const calendarData = CalendarStorage.getProfiles();
			setProfiles(calendarData.profiles);
			setActiveProfileId(calendarData.activeProfileId);

			const activeProfile = calendarData.profiles.find(
				(p) => p.id === calendarData.activeProfileId
			);
			if (activeProfile) {
				setSelections(activeProfile.selections);
				setSelectedComisiones(activeProfile.selectedComisiones);
			}
			setLoading(false);
		}
	}, [id, isFetchingUser]);

	const handleProfileChange = (profileId: string) => {
		const updatedData = CalendarStorage.setActiveProfile(profileId);
		setActiveProfileId(profileId);

		const activeProfile = updatedData.profiles.find((p) => p.id === profileId);
		if (activeProfile) {
			setSelections(activeProfile.selections);
			setSelectedComisiones(activeProfile.selectedComisiones);
		}
	};

	const handleCreateProfile = (name: string) => {
		const updatedData = CalendarStorage.createProfile(name);
		setProfiles(updatedData.profiles);
		setActiveProfileId(updatedData.activeProfileId);
		setSelections({});
		setSelectedComisiones({});
	};

	const handleDeleteProfile = (profileId: string) => {
		const updatedData = CalendarStorage.deleteProfile(profileId);
		setProfiles(updatedData.profiles);
		setActiveProfileId(updatedData.activeProfileId);

		const activeProfile = updatedData.profiles.find(
			(p) => p.id === updatedData.activeProfileId
		);
		if (activeProfile) {
			setSelections(activeProfile.selections);
			setSelectedComisiones(activeProfile.selectedComisiones);
		}
	};

	useEffect(() => {
		if (!loading && id && !isFetchingUser) {
			const updatedData = CalendarStorage.updateProfile(activeProfileId, {
				selections,
				selectedComisiones,
			});
			setProfiles(updatedData.profiles);

			if (user) {
				updateUserData(user.id, getStorageKey(), {
					selections,
					selectedComisiones,
				});
			}
		}
	}, [selections, selectedComisiones, loading, id, activeProfileId]);

	const uniqueSubjects: Record<string, {title: string; comisiones: string[]}> =
		{};

	subjectEvents.forEach((event) => {
		if (!uniqueSubjects[event.title]) {
			uniqueSubjects[event.title] = {
				title: event.title,
				comisiones: [],
			};
		}

		event.extendedProps.comisiones.forEach((comision) => {
			if (!uniqueSubjects[event.title].comisiones.includes(comision)) {
				uniqueSubjects[event.title].comisiones.push(comision);
			}
		});
	});

	useEffect(() => {
		const newSelectedComisiones = {...selectedComisiones};
		Object.entries(uniqueSubjects).forEach(([title, subject]) => {
			if (!newSelectedComisiones[title] && subject.comisiones.length > 0) {
				newSelectedComisiones[title] = subject.comisiones[0];
			}
		});
		setSelectedComisiones(newSelectedComisiones);
	}, [uniqueSubjects]);

	if (isLoading || loading || isFetchingUser) {
		return <div>Loading...</div>;
	}

	if (!subjectsData || !id) {
		return null;
	}

	const careerData = subjectsData.find((c) => c.id === id);
	if (!careerData) {
		return null;
	}

	const handleSubjectToggle = (subjectTitle: string) => {
		const comision = selectedComisiones[subjectTitle];
		const key = `${subjectTitle}_${comision}`;

		setSelections((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleComisionChange = (subjectTitle: string, comision: string) => {
		const oldComision = selectedComisiones[subjectTitle];
		const oldKey = `${subjectTitle}_${oldComision}`;
		const newKey = `${subjectTitle}_${comision}`;
		const wasSelected = selections[oldKey] || false;

		const newSelections = {...selections};

		if (oldKey in newSelections) {
			delete newSelections[oldKey];
		}

		newSelections[newKey] = wasSelected;

		setSelectedComisiones((prev) => ({
			...prev,
			[subjectTitle]: comision,
		}));

		setSelections(newSelections);
	};

	const filteredEvents: CalendarDisplayEvent[] = [];

	subjectEvents.forEach((event) => {
		const selectedComision = selectedComisiones[event.title];

		if (selectedComision) {
			if (event.extendedProps.comisiones.includes(selectedComision)) {
				const key = `${event.title}_${selectedComision}`;

				if (selections[key]) {
					filteredEvents.push({
						title: `${event.title} - ${selectedComision}`,
						daysOfWeek: event.daysOfWeek,
						startTime: event.startTime,
						endTime: event.endTime,
						extendedProps: {
							comision: selectedComision,
							comisiones: event.extendedProps.comisiones,
						},
						color: generateUniqueColor(event.title),
					});
				}
			}
		}
	});

	const handleBack = () => {
		navigate(`/materias/${id}`);
	};

	return (
		<Container maxW="container.xl">
			<Navbar
				customTitle="Horario Semanal"
				profiles={profiles}
				selectedProfile={activeProfileId}
				onProfileChange={handleProfileChange}
				onCreateProfile={handleCreateProfile}
				onDeleteProfile={handleDeleteProfile}
			/>

			<Box
				position="relative"
				minH="100vh"
				display="flex"
				flexDirection="column"
				py={4}
			>
				<Box p={4} flex="1" display="flex">
					<Box
						w="300px"
						bg="gray.50"
						p={4}
						borderRadius="md"
						boxShadow="md"
						mr={4}
						overflowY="auto"
						maxH="calc(100vh - 100px)"
					>
						<Heading as="h3" size="md" mb={4}>
							Mis Materias
						</Heading>
						<Input
							placeholder="Buscar materia..."
							mb={4}
							size="sm"
							variant="subtle"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>

						<VStack align="start" gap={3}>
							<AnimatePresence>
								{Object.entries(uniqueSubjects).filter(([title]) =>
									title
										.toLowerCase()
										.includes(debouncedSearchTerm.toLowerCase())
								).length === 0 ? (
									<motion.div
										key="no-results"
										initial={{opacity: 0, y: 20}}
										animate={{opacity: 1, y: 0}}
										exit={{opacity: 0, y: -20}}
									>
										<Text color="gray.500" textAlign="center" mt={4}>
											No se encontraron materias que coincidan con "
											{debouncedSearchTerm}"
										</Text>
									</motion.div>
								) : (
									Object.entries(uniqueSubjects)
										.filter(([title]) =>
											title
												.toLowerCase()
												.includes(debouncedSearchTerm.toLowerCase())
										)
										.map(([title, subject]) => {
											const selectedComision =
												selectedComisiones[title] ||
												subject.comisiones[0] ||
												"";
											const selectionKey = `${title}_${selectedComision}`;
											const isSelected = selections[selectionKey] || false;

											return (
												<motion.div
													key={title}
													layout
													initial={{opacity: 0, y: 20}}
													animate={{opacity: 1, y: 0}}
													exit={{opacity: 0, y: -20}}
													transition={{duration: 0.2}}
													style={{width: "100%"}}
												>
													<Box
														width="100%"
														p={2}
														borderWidth="1px"
														borderRadius="md"
													>
														<Flex align="center" mb={2}>
															<BasicCheckbox
																checked={isSelected}
																onCheckedChange={() =>
																	handleSubjectToggle(title)
																}
																label=""
															/>
															<Text fontWeight="bold" ml={2}>
																{title}
															</Text>
														</Flex>
														<select
															value={selectedComision}
															onChange={(e) =>
																handleComisionChange(title, e.target.value)
															}
															style={{
																width: "100%",
																padding: "0.4rem",
																fontSize: "0.875rem",
																borderRadius: "0.375rem",
																backgroundColor: "white",
															}}
														>
															{subject.comisiones.map((comision) => (
																<option key={comision} value={comision}>
																	{comision}
																</option>
															))}
														</select>
													</Box>
												</motion.div>
											);
										})
								)}
							</AnimatePresence>
						</VStack>
					</Box>

					<Box flex="1">
						<HStack justify="flex-start" mb={4}>
							<Button onClick={handleBack} variant="outline">
								<Box mr={2} display="inline-flex">
									<RiArrowLeftLine />
								</Box>
								Volver
							</Button>
						</HStack>

						<Box
							bg="white"
							borderRadius="md"
							boxShadow="md"
							p={2}
							h="calc(100vh - 200px)"
						>
							<FullCalendar
								plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
								initialView="timeGridWeek"
								headerToolbar={{
									left: "prev,next today",
									center: "title",
									right: "dayGridMonth,timeGridWeek,timeGridDay",
								}}
								locale={esLocale}
								slotMinTime="08:00:00"
								slotMaxTime="22:00:00"
								allDaySlot={false}
								height="100%"
								events={filteredEvents}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};

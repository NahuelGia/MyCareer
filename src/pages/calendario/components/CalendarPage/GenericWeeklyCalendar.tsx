import {Box} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";

interface GenericWeeklyCalendarProps {
	events: any[];
}

export const GenericWeeklyCalendar = ({events}: GenericWeeklyCalendarProps) => {
	return (
		<Box
			bg={"transparent"}
			borderRadius="lg"
			boxShadow="lg"
			h="calc(100vh - 200px)"
		>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				locale={esLocale}
				slotMinTime="08:00:00"
				slotMaxTime="23:00:00"
				allDaySlot={false}
				height="100%"
				events={events}
				hiddenDays={[0, 7]}
				headerToolbar={false}
				dayHeaderFormat={{weekday: "long"}}
				initialDate="2025-01-01"
				navLinks={false}
				dayHeaderClassNames="custom-day-header"
				slotLabelFormat={{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}}
				dayCellClassNames="custom-day-cell"
				eventDisplay="block"
				eventBackgroundColor="#3182ce"
				eventBorderColor="#2c5aa0"
				eventTextColor="white"
				slotDuration="01:00:00"
				slotLabelInterval="01:00:00"
				aspectRatio={1.8}
			/>

			<style jsx global>{`
				.fc-col-header-cell {
					background-color: #f7fafc !important;
					border-bottom: 2px solid #e2e8f0 !important;
					font-weight: 600 !important;
					color: #2d3748 !important;
					padding: 12px 8px !important;
				}

				.fc-col-header-cell .fc-col-header-cell-cushion {
					color: #2d3748 !important;
					text-decoration: none !important;
					font-size: 20px !important;
					text-transform: capitalize !important;
				}

				.fc-timegrid-slot {
					border-color: #e2e8f0 !important;
				}

				.fc-timegrid-slot-label {
					color: #718096 !important;
					font-size: 20px !important;
					padding: 0 8px !important;
					font-weight: 500 !important;
				}

				.fc-timegrid-col {
					border-color: #e2e8f0 !important;
				}

				.fc-event {
					border-radius: 6px !important;
					border: none !important;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
					font-size: 12px !important;
					font-weight: 500 !important;
				}

				.fc-event:hover {
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
					transform: translateY(-1px) !important;
					transition: all 0.2s ease !important;
				}

				.fc-scrollgrid {
					border-color: #e2e8f0 !important;
					border-radius: 8px !important;
					overflow: hidden !important;
				}

				.fc-theme-standard td,
				.fc-theme-standard th {
					border-color: #e2e8f0 !important;
				}

				.fc-timegrid-axis {
					background-color: #f7fafc !important;
				}

				.fc-timegrid-slot-minor {
					border-top-style: dotted !important;
					border-top-color: #cbd5e0 !important;
				}
			`}</style>
		</Box>
	);
};

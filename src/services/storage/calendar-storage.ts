import { SubjectsStorageService } from './local-storage';

export interface CalendarEvent {
  id: string;
  title: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  extendedProps: {
    comision: string;
  };
}

const STORAGE_KEY = 'calendar_events';

export class CalendarStorageService {
  static async getEvents(careerId: string): Promise<CalendarEvent[]> {
    try {
      const storedEvents = localStorage.getItem(`${STORAGE_KEY}_${careerId}`);
      if (storedEvents) {
        return JSON.parse(storedEvents);
      }
      
      const defaultEvents = this.generateDefaultEvents();
      await this.saveEvents(careerId, defaultEvents);
      return defaultEvents;
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  }

  static async saveEvents(careerId: string, events: CalendarEvent[]): Promise<void> {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${careerId}`, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving calendar events:', error);
    }
  }

  private static generateDefaultEvents(): CalendarEvent[] {
    return [
      {
        id: '1',
        title: 'Matemática',
        daysOfWeek: ['4'], // Thursday
        startTime: '08:00:00',
        endTime: '10:00:00',
        extendedProps: {
          comision: '1A',
        }
      },
      {
        id: '2',
        title: 'Matemática',
        daysOfWeek: ['5'], // Friday
        startTime: '14:00:00',
        endTime: '16:00:00',
        extendedProps: {
          comision: '1A',
        }
      },
      {
        id: '3',
        title: 'Intro',
        daysOfWeek: ['3'], // Wednesday
        startTime: '10:00:00',
        endTime: '14:00:00',
        extendedProps: {
          comision: 'K',
        }
      },
      {
        id: '4',
        title: 'Intro',
        daysOfWeek: ['5'], // Friday
        startTime: '18:00:00',
        endTime: '22:00:00',
        extendedProps: {
          comision: 'K',
        }
      },
      {
        id: '5',
        title: 'EPYL',
        daysOfWeek: ['1'], // Monday
        startTime: '08:00:00',
        endTime: '12:00:00',
        extendedProps: {
          comision: 'A',
        }
      },
      {
        id: '6',
        title: 'ORGA',
        daysOfWeek: ['2'], // Tuesday
        startTime: '14:00:00',
        endTime: '18:00:00',
        extendedProps: {
          comision: 'C',
        }
      },
      {
        id: '7',
        title: 'OBJ1',
        daysOfWeek: ['4'], // Thursday
        startTime: '16:00:00',
        endTime: '20:00:00',
        extendedProps: {
          comision: 'B',
        }
      },
    ];
  }
} 
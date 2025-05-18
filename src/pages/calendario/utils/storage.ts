import { v4 as uuidv4 } from "uuid";

export interface CalendarProfile {
  id: string;
  name: string;
  selections: Record<string, boolean>;
  selectedComisiones: Record<string, string>;
}

export interface CalendarProfiles {
  profiles: CalendarProfile[];
  activeProfileId: string;
}

const STORAGE_KEY = "calendar_profiles";

export const CalendarStorage = {
  getProfiles: (): CalendarProfiles => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Create default profile if none exists
      const defaultProfile: CalendarProfile = {
        id: uuidv4(),
        name: "Perfil Principal",
        selections: {},
        selectedComisiones: {},
      };
      const profiles: CalendarProfiles = {
        profiles: [defaultProfile],
        activeProfileId: defaultProfile.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      return profiles;
    }
    return JSON.parse(data);
  },

  createProfile: (name: string): CalendarProfiles => {
    const currentData = CalendarStorage.getProfiles();
    const newProfile: CalendarProfile = {
      id: uuidv4(),
      name,
      selections: {},
      selectedComisiones: {},
    };

    const updatedData: CalendarProfiles = {
      profiles: [...currentData.profiles, newProfile],
      activeProfileId: newProfile.id,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  },

  deleteProfile: (profileId: string): CalendarProfiles => {
    const currentData = CalendarStorage.getProfiles();
    const updatedProfiles = currentData.profiles.filter(
      (p) => p.id !== profileId
    );

    // If we're deleting the active profile, switch to the first available profile
    const newActiveProfileId =
      currentData.activeProfileId === profileId
        ? updatedProfiles[0].id
        : currentData.activeProfileId;

    const updatedData: CalendarProfiles = {
      profiles: updatedProfiles,
      activeProfileId: newActiveProfileId,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  },

  updateProfile: (
    profileId: string,
    updates: Partial<CalendarProfile>
  ): CalendarProfiles => {
    const currentData = CalendarStorage.getProfiles();
    const updatedProfiles = currentData.profiles.map((profile) =>
      profile.id === profileId ? { ...profile, ...updates } : profile
    );

    const updatedData: CalendarProfiles = {
      profiles: updatedProfiles,
      activeProfileId: currentData.activeProfileId,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  },

  setActiveProfile: (profileId: string): CalendarProfiles => {
    const currentData = CalendarStorage.getProfiles();
    const updatedData: CalendarProfiles = {
      ...currentData,
      activeProfileId: profileId,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  },
};

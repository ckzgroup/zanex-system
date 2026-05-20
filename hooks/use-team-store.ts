import create from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


type Team = {
    label: string;
    value: string;
    title: string;
    link: string;
};

type TeamStore = {
    selectedTeam: Team;
    setSelectedTeam: (team: Team) => void;
};

export const useTeamStore = create<TeamStore>( // @ts-ignore
    persist(
        (set) => ({
            rehydrated: false,
            selectedTeam: { label: "Project Mgmt", value: "logo2", title: "PROJECTS", link: "/" },
            setSelectedTeam: (team: Team) => set({ selectedTeam: team }), // @ts-ignore
            setRehydrated: (rehydrated: any) => set({ rehydrated }),

        }),
        {
            name: 'team-storage', // name of the item in the storage
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {// @ts-ignore
                state?.setRehydrated(true);
            },

        }
    )
);

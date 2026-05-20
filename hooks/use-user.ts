"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DeviceInfo, getDeviceInfo } from '@/utils/device-info';

interface User {
    token: string;
    message: string;
    result: {
        user_id: string;
        user_company_id: string;
        user_email_address: string;
        user_firstname: string;
        user_lastname: string;
        company_name: string;
        company_logo: string;
        user_contact: string;
        deviceInfo: DeviceInfo;
    }
}

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    activeDevices: DeviceInfo[];
    rehydrated: boolean;
    theme: string; // Add theme property
    login: (user: User) => void;
    logout: () => void;
    getCompanyId: () => string | null;
    getActiveDevices: () => DeviceInfo[];
    removeDevice: (deviceId: string) => void;
    setRehydrated: (rehydrated: boolean) => void;
    getUserId: () => string | null; // Add getUserId function
    setTheme: (theme: string) => void; // Add setTheme function
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            activeDevices: [] as DeviceInfo[],
            isAuthenticated: false,
            rehydrated: false,
            theme: 'system', // Set a default theme
            login: (user) => {
                set({
                    user: { ...user },
                    isAuthenticated: true,
                });
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, activeDevices: [], theme: 'light' });
                localStorage.removeItem('auth');
            },
            getCompanyId: () => {
                const user = get().user;
                return user ? user.result.user_company_id : null;
            },
            getUserId: () => {
                const user = get().user;
                return user ? user.result.user_id : null;
            },
            getActiveDevices: () => get().activeDevices,
            removeDevice: (deviceId) => {
                const currentDevices = get().activeDevices;
                const updatedDevices = currentDevices.filter((device) => device.deviceId !== deviceId);
                set({ activeDevices: updatedDevices });
            },
            setTheme: (theme) => set({ theme }), // Function to set the theme
            setRehydrated: (rehydrated) => set({ rehydrated }),

        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setRehydrated(true);
                if (state && state.user) {
                    state.isAuthenticated = true;
                }
            },
        }
    )
);

export default useAuthStore;

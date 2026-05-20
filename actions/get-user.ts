// Function to fetch data from a given endpoint

import axios from "axios";

import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchUserData = async (endpoint: string, token: string, user_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?id=${user_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchRoleData = async (endpoint: string, token: string, user_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?user_id=${user_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// Custom hook for fetching data
export const useSingleUser = (endpoint: string, user_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, user_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchUserData(endpoint, token, user_id);
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useSingleUserRole = (endpoint: string, user_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, user_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchRoleData(endpoint, token, user_id);
        },
        enabled: !!token,
    });
};


// Function to DELETE data from a given endpoint with user_id
const deleteData = async (endpoint: string, user_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append user_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?user_id=${user_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to DELETE data from a given endpoint
const deleteRoleData = async (endpoint: string, user_role_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await axiosInstance.delete(`${endpoint}?user_role_id=${user_role_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom hook for DELETEing data
export const useDeleteUser = (endpoint: string, user_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept user_id as an argument
            if (!token) throw new Error('No token available');
            return deleteData(endpoint, user_id, token);  // Pass user_id to deleteData
        },
        onMutate: () => {
            // A mutation is about to happen!
            // Optionally return a context containing data to use when for example rolling back
            return { id: 1 };
        },
        onError: (error, variables, context) => {
            // An error happened!
            // @ts-ignore
            console.log(`Rolling back optimistic update with id ${context?.id}`);
        },
        onSuccess: (data, variables, context) => {
            // Success handling
            console.log('DELETE successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('DELETE settled', { data, error });
        },
    });
};

// Custom hook for DELETEing data
export const useDeleteUserRole = (endpoint: string) => {
    const token = useAuthStore((state) => state.user?.token); // Get token

    return useMutation({
        mutationFn: (user_role_id: number | string) => { // Accept user_role_id dynamically
            if (!token) throw new Error('No token available');
            return deleteRoleData(endpoint, user_role_id, token);
        },
        onSuccess: (data) => {
            console.log('DELETE successful!', data);
        },
        onError: (error) => {
            console.error('Error deleting role:', error);
        },
        onSettled: () => {
            console.log('DELETE settled');
        },
    });
};
// Function to fetch data from a given endpoint
import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchUserData = async (endpoint: string, token: string, service_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?service_id=${service_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchProjectService = async (endpoint: string, token: string, project_service_id: number) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?project_service_id=${project_service_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchBudgetService = async (endpoint: string, token: string, budget_item_id: number) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?budget_item_id=${budget_item_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// Custom hook for fetching data
export const useSingleService = (endpoint: string, service_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, service_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchUserData(endpoint, token, service_id);
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useSingleProjectService = (endpoint: string, project_service_id: number) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, project_service_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchProjectService(endpoint, token, project_service_id);
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useSingleBudgetService = (endpoint: string, budget_item_id: number) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, budget_item_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchBudgetService(endpoint, token, budget_item_id);
        },
        enabled: !!token,
    });
};

// Function to DELETE data from a given endpoint with user_id
const deleteData = async (endpoint: string, service_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append user_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?service_id=${service_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to DELETE data from a given endpoint with user_id
const deleteProjectData = async (endpoint: string, project_service_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append user_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?project_service_id=${project_service_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to DELETE data from a given endpoint with user_id
const deleteBudgetData = async (endpoint: string, budget_item_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append user_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?budget_item_id=${budget_item_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom hook for DELETEing data
export const useDeleteService = (endpoint: string, service_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept user_id as an argument
            if (!token) throw new Error('No token available');
            return deleteData(endpoint, service_id, token);  // Pass user_id to deleteData
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
export const useDeleteProjectService = (endpoint: string, project_service_id: number) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept user_id as an argument
            if (!token) throw new Error('No token available');
            return deleteProjectData(endpoint, project_service_id, token);  // Pass user_id to deleteData
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
export const useDeleteBudgetService = (endpoint: string, budget_item_id: number) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept user_id as an argument
            if (!token) throw new Error('No token available');
            return deleteBudgetData(endpoint, budget_item_id, token);  // Pass user_id to deleteData
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

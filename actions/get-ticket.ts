// Function to fetch data from a given endpoint
import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchTicketData = async (endpoint: string, token: string, ticket_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?ticket_id=${ticket_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// Custom hook for fetching data
export const useSingleTicket = (endpoint: string, ticket_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, ticket_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchTicketData(endpoint, token, ticket_id);
        },
        enabled: !!token,
    });
};


const fetchTickets = async (endpoint: string, token: string, company_id: string | undefined,  ticket_status: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body ? company_id=1
        const response = await axiosInstance.get(`${endpoint}?company_id=${company_id}&status=${ticket_status}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Fetch ALL Tickets
export const useTickets = (endpoint: string, ticket_status: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);
    // @ts-ignore
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);
    return useQuery({
        queryKey: ['fetchData', endpoint, company_id, ticket_status],
        queryFn: async () => {

            if (!token) throw new Error('No token available');
            return fetchTickets(endpoint, token, company_id, ticket_status);
        },
        enabled: !!token,
    });
};


// Function to fetch ticket materials
const fetchTicketMaterials = async (endpoint: string, token: string, ticket_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        const response = await axiosInstance.get(`${endpoint}?ticket_id=${ticket_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching ticket materials:', error);
        throw error;
    }
};

// Custom hook for fetching ticket materials
export const useTicketMaterials = (endpoint: string, ticket_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchTicketMaterials', endpoint, ticket_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchTicketMaterials(endpoint, token, ticket_id);
        },
        enabled: !!token,
    });
};

// Function to DELETE data from a given endpoint with ticket_id
const deleteData = async (endpoint: string, ticket_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append ticket_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?ticket_id=${ticket_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom hook for DELETEing data
export const useDeleteTicket = (endpoint: string, ticket_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept ticket_id as an argument
            if (!token) throw new Error('No token available');
            return deleteData(endpoint, ticket_id, token);  // Pass ticket_id to deleteData
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

// Function to fetch data from a given endpoint
import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchClosureItemData = async (endpoint: string, token: string, project_closure_parameter_id: number | string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?project_closure_parameter_id=${project_closure_parameter_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// Custom hook for fetching data
export const useSingleClosureItem = (endpoint: string, project_closure_parameter_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, project_closure_parameter_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchClosureItemData(endpoint, token, project_closure_parameter_id);
        },
        enabled: !!token,
    });
};



// Function to DELETE data from a given endpoint with user_id
const deleteData = async (endpoint: string, project_closure_parameter_id: number | string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        // Append user_id to the endpoint
        const response = await axiosInstance.delete(`${endpoint}?project_closure_parameter_id=${project_closure_parameter_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom hook for DELETEing data
export const useDeleteClosureItem = (endpoint: string, project_closure_parameter_id: number | string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: () => {  // Accept user_id as an argument
            if (!token) throw new Error('No token available');
            return deleteData(endpoint, project_closure_parameter_id, token);  // Pass user_id to deleteData
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

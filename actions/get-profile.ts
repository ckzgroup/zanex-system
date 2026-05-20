// Function to fetch data from a given endpoint
import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchProfileData = async (endpoint: string, token: string, user_id: number | string) => {
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
export const useProfile = (endpoint: string, user_id: number) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['fetchData', endpoint, user_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchProfileData(endpoint, token, user_id);
        },
        enabled: !!token,
    });
};

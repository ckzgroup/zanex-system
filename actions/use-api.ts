import axios from 'axios';
import {useMutation, useQuery} from '@tanstack/react-query';

import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL
const IMAGES = process.env.NEXT_PUBLIC_IMAGES; // Replace with your actual API base URL

// Function to fetch data from a given endpoint
const fetchData = async (endpoint: string, token: string, company_id: string | undefined) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?company_id=${company_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


export const normalFetchData = async (endpoint: string, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Function to post data to a given endpoint
const postData = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Function to post data to a given endpoint
const postProjectData = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data, application/json',
        }
    });

    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to post data to a given endpoint
const postImage = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Function to post data to a given endpoint
const postReportData = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: IMAGES,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom hook for fetching data
 const useFetchData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user.token);
    // @ts-ignore
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);

    return useQuery({
        queryKey: ['fetchData', endpoint, company_id],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchData(endpoint, token, company_id);
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useNormalFetchData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user.token);
    // @ts-ignore

    return useQuery({
        queryKey: ['fetchData', endpoint],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return normalFetchData(endpoint, token);
        },
        enabled: !!token,
    });
};

export default useFetchData;

// Custom hook for posting data
export const usePostData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return postData(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('Mutation successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('Mutation settled', { data, error });
        },
    });
};


// Custom hook for posting Projecy
export const usePostProjectData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return postProjectData(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('Mutation successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('Mutation settled', { data, error });
        },
    });
};

// Custom hook for posting image
export const usePostImage = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return postImage(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('Mutation successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('Mutation settled', { data, error });
        },
    });
};

// Custom hook for posting data
export const usePostReport = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return postReportData(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('Mutation successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('Mutation settled', { data, error });
        },
    });
};


// Function to PATCH data to a given endpoint
const patchData = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await axiosInstance.patch(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to PATCH data to a given endpoint
const patchProjectData = async (endpoint: string, data: any, token: string) => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data, application/json',
        }
    });

    try {
        const response = await axiosInstance.patch(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Custom hook for PATCHing data
export const usePatchData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return patchData(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('PATCH successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('PATCH settled', { data, error });
        },
    });
};


// Custom hook for PATCHing data
export const usePatchProjectData = (endpoint: string) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useMutation({
        mutationFn: (data: any) => {
            if (!token) throw new Error('No token available');
            return patchProjectData(endpoint, data, token);
        },
        onMutate: (variables) => {
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
            console.log('PATCH successful!', data);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            console.log('PATCH settled', { data, error });
        },
    });
};
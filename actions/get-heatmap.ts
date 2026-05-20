// Function to fetch data from a given endpoint
import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL

const fetchDistributionMapData = async (
    endpoint: string,
    token: string,
    from_date: Date | string,
    to_date: Date | string,
    client_id: number | string,
    service_type: number | string,
    site: number | undefined,
    sla_status: string,
    ticket_status: string,
) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?from_date=${from_date}&to_date=${to_date}&client_id=${client_id}&service_type=${service_type}&site=${site}&sla_status=${sla_status}&ticket_status=${ticket_status}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchDistributionMapFilterData = async (
  endpoint: string,
  token: string,
  company_id: number | string,
  startDate: Date | string,
  endDate: Date | string,
) => {
  const axiosInstance = axios.create({
    baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  try {
    // Use POST instead of GET and include company_id in the request body  ?company_id=1
    const response = await axiosInstance.get(`${endpoint}?company_id=${company_id}&startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const fetchHeatmapData = async (
    endpoint: string,
    token: string,
    from_date: Date | string,
    to_date: Date | string,
    client_id: number | string,
    service_type: number | string,
                                ) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?from_date=${from_date}&to_date=${to_date}&client_id=${client_id}&service_type=${service_type}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Custom hook for fetching data
export const useHeatmap = (
    endpoint: string,
    from_date: Date | string,
    to_date: Date | string,
    client_id: number | string,
    service_type: number | string,
) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['Heatmap', endpoint, from_date, to_date, client_id, service_type],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchHeatmapData(endpoint, token, from_date, to_date, client_id, service_type );
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useDistributionMap = (
    endpoint: string,
    from_date: Date | string,
    to_date: Date | string,
    client_id: number | string,
    service_type: number | string,
    site:  number,
    sla_status: string,
    ticket_status: string,
) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);

    return useQuery({
        queryKey: ['Heatmap', endpoint, from_date, to_date, client_id, service_type, site, sla_status, ticket_status] ,
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchDistributionMapData(endpoint, token, from_date, to_date, client_id, service_type, site, sla_status, ticket_status);
        },
        enabled: !!token,
    });
};


// Custom hook for fetching data
export const useDistributionMapFilter = (
  endpoint: string,
  company_id: number | string,
  startDate: Date | string,
  endDate: Date | string,
) => {
  // @ts-ignore
  const token = useAuthStore((state) => state.user?.token);

  return useQuery({
    queryKey: ['DistributionMap', endpoint, company_id, startDate, endDate, ] ,
    queryFn: async () => {
      if (!token) throw new Error('No token available');
      return fetchDistributionMapFilterData(endpoint,token, company_id, startDate, endDate);
    },
    enabled: !!token,
  });
};


const fetchComponentMapData = async (
    endpoint: string,
    token: string,
    from_date: Date | string,
    to_date: Date | string,
    segment_id: number | string,
    select_status: string,
) => {
    const axiosInstance = axios.create({
        baseURL: API_URL, // Ensure API_URL is defined and accessible in your environment
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    try {
        // Use POST instead of GET and include company_id in the request body  ?company_id=1
        const response = await axiosInstance.get(`${endpoint}?segment_id=${segment_id}&select_status=${select_status}from_date=${from_date}&to_date=${to_date}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Custom hook for fetching data
export const useComponentMap = (
    endpoint: string,
    from_date: Date | string,
    to_date: Date | string,
    segment_id: number | string,
    select_status: string,
) => {
    // @ts-ignore
    const token = useAuthStore((state) => state.user?.token);


    return useQuery({
        queryKey: ['ComponentMap', endpoint, from_date, to_date, segment_id, select_status],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            return fetchComponentMapData(endpoint, token, from_date, to_date, segment_id, select_status );
        },
        enabled: !!token,
    });
};

"use client";

import React, {useEffect, useState} from 'react';
// @ts-ignore
import GoogleMapReact from 'google-map-react';
import { format } from 'date-fns';
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { useHeatmap } from "@/actions/get-heatmap";
import DatePicker  from "@/components/ui/datepicker";
import {Input} from "@/components/ui/input";
import {useSingleCustomer} from "@/actions/get-customer"; // Assume a date picker component is available

const YOUR_API_KEY = "AIzaSyCtzU8DKz41jajN0u6Enpn0ln1OtFKRTYE";

const DEFAULT_LAT = 0.04626;
const DEFAULT_LNG = 37.65587;


const calculateCenter = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
    if (points.length === 0) {
        return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
    }
    const sum = points.reduce(
        (acc, point) => ({
            lat: acc.lat + point.lat,
            lng: acc.lng + point.lng,
        }),
        { lat: 0, lng: 0 }
    );
    return {
        lat: sum.lat / points.length,
        lng: sum.lng / points.length,
    };
};


const formatDate = (date: string | null): string => {
    if (!date) return ""; // Return empty string for null dates
    //@ts-ignore
    return new Intl.DateTimeFormat("en-CA").format(date); // Format as YYYY-MM-DD
};

const HeatmapComponent: React.FC = () => {
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | string | null>(null);
    const [selectedService, setSelectedService] = useState<number | string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0.1765, lng: 37.913 }); // State for dynamic map center
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null); // Customer ID

    // Fetch clients and services
    const { data: clientData } = useFetchData('/customers');
    const clients = Array.isArray(clientData) ? clientData.reverse() : [];


    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter((client) =>
        client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Fetch Service based on the selected customer
    const { isLoading: serviceLoading, error: serviceError, data: serviceData } = useSingleCustomer(
        "/radar/site/services",
        parseInt(selectedCustomerId || "0")
    );
    const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

    const [serviceSearchTerm, setServiceSearchTerm] = useState("");

    const filteredServices = services.filter((service) =>
        service.service_name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );

    // Fetch maps data
    const { data: heatmapData } = useHeatmap(
        '/maintenance/getHeatMap',
        formatDate(fromDate), // Format the date
        formatDate(toDate),
        selectedClient || '',
        selectedService || ''
    );

    const heatmapPoints = Array.isArray(heatmapData)
        ? heatmapData.map((point) => ({ lat: point.lat, lng: point.lon }))
        : [];

    // Select the first point as the center
    useEffect(() => {
        if (heatmapPoints.length > 0) {
            const newCenter = heatmapPoints[0]; // Pick the first maps point
            // Only update the center if it's different from the current mapCenter
            if (newCenter.lat !== mapCenter.lat || newCenter.lng !== mapCenter.lng) {
                setMapCenter(newCenter); // Update the map center dynamically
            }
        }
    }, [heatmapPoints, mapCenter]); // Only update when heatmapPoints or mapCenter changes

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {/* Date Range Picker */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">From Date</h4>
                    <DatePicker //@ts-ignore
                        selected={fromDate} //@ts-ignore
                        onChange={(date) => setFromDate(date)}
                        placeholderText="From Date"
                    />
                </div>

                <div className="space-y-2">
                    <h4 className="text-base font-semibold">To Date</h4>
                    <DatePicker //@ts-ignore
                        selected={toDate} //@ts-ignore
                        onChange={(date) => setToDate(date)}
                        placeholderText="To Date"
                    />
                </div>

                {/* Client Selector */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">Customer</h4>
                    <Select onValueChange={(value) => {
                        setSelectedCustomerId(value); // Update selected customer ID
                        setSelectedClient(value)
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Search Input */}
                            <div className="p-2">
                                <Input
                                    placeholder="Search Customer"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={(e) => e.target.select()} // Safely handle focus
                                />
                            </div>

                            {/* Filtered Customer List */}
                            {filteredClients.map((client) => (
                                <SelectItem
                                    key={client.customer_id}
                                    value={`${client.customer_id}`}
                                    onClick={() => setSelectedCustomerId(client.customer_id.toString())}
                                >
                                    {client.customer_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Service Selector */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">Service</h4>
                    <Select onValueChange={(value) => setSelectedService(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Search Input */}
                            <div className="p-2">
                                <Input
                                    placeholder="Search Service"
                                    value={serviceSearchTerm}
                                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                                    onFocus={(e) => e.target.select()} // Safely handle focus
                                />
                            </div>

                            {/* Filtered Service List */}
                            {filteredServices.map((service) => (
                                <SelectItem key={service.service_id} value={`${service.service_id}`}>
                                    {service.service_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                </div>

                {/* Heatmap */}
                <div className="relative h-[80vh] w-[72vw]">
                    <GoogleMapReact
                        bootstrapURLKeys={{key: YOUR_API_KEY}}
                        defaultCenter={mapCenter}
                        defaultZoom={6.2}
                        center={mapCenter}
                        zoom={6.2}
                        heatmap={{
                            positions: heatmapPoints,
                            options: {radius: 10, opacity: 0.6}
                        }}
                        heatmapLibrary={true}
                    ></GoogleMapReact>
                </div>
            </div>
            );
            };

            export default HeatmapComponent;

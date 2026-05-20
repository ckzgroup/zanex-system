"use client";

import React, {useEffect, useState} from 'react';
// @ts-ignore
import GoogleMapReact from 'google-map-react';
import { format } from 'date-fns';
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import {useComponentMap, useHeatmap} from "@/actions/get-heatmap";
import DatePicker  from "@/components/ui/datepicker";
import {Input} from "@/components/ui/input";
import {useSingleCustomer} from "@/actions/get-customer";
import {usePathname} from "next/navigation";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"; // Assume a date picker component is available


const YOUR_API_KEY = "AIzaSyCtzU8DKz41jajN0u6Enpn0ln1OtFKRTYE";

const DEFAULT_LAT = 0.04626;
const DEFAULT_LNG = 37.65587;

// Pin icon URL for the marker
const PIN_ICON = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

// Default coordinates when no data is available
const DEFAULT_CENTER = { lat: 0.1765, lng: 37.913 };

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

const SegmentMapComponent: React.FC = () => {
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0.1765, lng: 37.913 }); // State for dynamic map center
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null); // Customer ID
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    // Fetch clients and services
    const { data: clientData } = useFetchData('/customers');
    const clients = Array.isArray(clientData) ? clientData.reverse() : [];

    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [markers, setMarkers] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter((client) =>
        client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));


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
    const { data: heatmapData } = useComponentMap(
        '/segment_dashboard/getSegmentMap',
        formatDate(fromDate), // Format the date
        formatDate(toDate),
        segment_id,
        selectedStatus || ''
    );

    const maps = Array.isArray(heatmapData) ? heatmapData.reverse() : [];

  console.log(maps);

    useEffect(() => {
        // Prepare the map points with necessary data
        const mapPoints = maps.map((map: any) => ({
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lon),
            title: map.title,
            service_name: map.service_name,
            segment_name: map.segment_name,
            job_type: map.job_type,
            activity_date: map.activity_date,
            image: map.image,
            user_firstname: map.user_firstname,
            user_comment: map.user_comment,
        }));

        if (mapPoints.length > 0) {
            // Set center to the first marker's location or calculate the center
            setCenter(calculateCenter(mapPoints));
            setMarkers(mapPoints);
        } else {
            // Use default coordinates if no map data is available
            setCenter(DEFAULT_CENTER);
        }
    }, [maps]);

    // Handle marker click to display ticket details
    const handleMarkerClick = (ticket: any) => {
        setSelectedTicket(ticket);
    };

    // Marker Component
    const Marker = ({ lat, lng }: { lat: number; lng: number }) => (
        <div  onClick={() => handleMarkerClick(lng)} style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
            <img src={PIN_ICON} alt="Pin" style={{ width: '30px', height: '30px' }} />
        </div>
    );


    const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/projectImages/';


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
                    <h4 className="text-base font-semibold"> Status </h4>
                    <Select onValueChange={(value) => {
                        setSelectedCustomerId(value); // Update selected customer ID
                        setSelectedStatus(value)
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                                <SelectItem
                                    value="All"
                                >
                                    All
                                </SelectItem>

                            <SelectItem
                                value="Filter"
                            >
                                Filter
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                </div>

            {/* Map with Markers */}
            <div className="relative h-[80vh] w-[72vw]">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: YOUR_API_KEY }}
                    defaultCenter={center}
                    defaultZoom={7}
                    center={center}
                    zoom={7}
                >
                    {markers.map((marker, index) => (
                        <div
                            key={index} //@ts-ignore
                            lat={marker.lat}
                            lng={marker.lng}
                            onClick={() => handleMarkerClick(marker)}
                        >
                            {/* Custom Pin Marker */}
                            <img src={PIN_ICON} alt="Pin" style={{ width: '30px', height: '30px' }} />
                        </div>
                    ))}
                </GoogleMapReact>
            </div>

            {/* Ticket Details */}
            {selectedTicket && (
                <div className="ticket-details p-6 bg-accent border rounded-md shadow-md mt-4 w-[90%]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Segment Details</h3>
                            <p><strong>Name:</strong> {selectedTicket.segment_name}</p>
                            <p><strong>Title:</strong> {selectedTicket.title}</p>
                            <p><strong>Job Type:</strong> {selectedTicket.job_type}</p>
                            <p><strong>Service:</strong> {selectedTicket.service_name}</p>
                            <p><strong>Comment:</strong> {selectedTicket.user_comment}</p>
                            <p><strong>Activity Date:</strong> {selectedTicket.activity_date}</p>

                        </div>
                        <div>
                            {selectedTicket.image && (
                                <div className="space-y-4">
                                    <strong>Uploaded Image:</strong>

                                    <Dialog>
                                        <div className="relative">
                                            <DialogTrigger asChild>
                                                <img
                                                    src={`${IMAGE}${selectedTicket.image}`}
                                                    alt="image"
                                                    className="w-52 h-64 object-cover hover:cursor-pointer rounded-md" // Tailwind classes for width and height
                                                />
                                            </DialogTrigger>
                                        </div>

                                        <DialogContent className="sm:max-w-[425px]">
                                            <img src={`${IMAGE}${selectedTicket.image}`}
                                                 alt="img"
                                                 className="h-full w-fit object-cover"
                                            />
                                        </DialogContent>
                                    </Dialog>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            </div>
            );
            };

            export default SegmentMapComponent;

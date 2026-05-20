"use client"

import React, { useEffect, useState } from "react";
// @ts-ignore
import GoogleMapReact from "google-map-react";
import { format } from "date-fns";
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { useDistributionMap, useHeatmap } from "@/actions/get-heatmap";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useSingleCustomer } from "@/actions/get-customer";
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

const DistributionMap: React.FC = () => {
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | string | null>(null);
    const [selectedService, setSelectedService] = useState<number | string | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null); // Customer ID
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [selectedSlaStatus, setSelectedSlaStatus] = useState<string | null>(null);
    const [selectedTicketStatus, setSelectedTicketStatus] = useState<string | null>(null);

    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [markers, setMarkers] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0.1765, lng: 37.913 }); // State for dynamic map center


  const { data: all_data } = useFetchData("/maintenance/distributionMap");
  const lll = Array.isArray(all_data) ? all_data.reverse() : [];


  // Fetch clients and services
    const { data: clientData } = useFetchData("/customers");
    const clients = Array.isArray(clientData) ? clientData.reverse() : [];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter((client) =>
        client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch Services based on the selected customer
    const { isLoading: serviceLoading, error: serviceError, data: serviceData } = useSingleCustomer(
        "/radar/site/services",
        parseInt(selectedCustomerId || "0")
    );
    const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

    const [serviceSearchTerm, setServiceSearchTerm] = useState("");

    const filteredServices = services.filter((service) =>
        service.service_name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );

    // Fetch SITES based on the selected customer
    const { isLoading: sitesLoading, error: sitesError, data: sitesData } = useSingleCustomer(
        "/radar/site/customer",
        parseInt(selectedCustomerId || "0")
    );

    const sites = Array.isArray(sitesData) ? sitesData.reverse() : [];

    // Fetch heatmap data
    const { data: heatmapData } = useDistributionMap(
        "/maintenance/distributionMap",
        formatDate(fromDate), // Format the date
        formatDate(toDate),
        selectedClient || '',
        selectedService || '', // @ts-ignore
        selectedSite || '',
        selectedSlaStatus || '',
        selectedTicketStatus || ''
    );

    const maps = Array.isArray(heatmapData) ? heatmapData.reverse() : [];


    useEffect(() => {
        // Prepare the map points with necessary data
        const mapPoints = maps.map((map: any) => ({
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lon),
            id: map.ticket_no,
            service_title: map.service_title,
            comment: map.ticket_action_description,
            image: map.ticket_service_image,
            customer_name: map.customer_name,
            ticket_update_time: map.ticket_update_time,
            user_name: map.user_name,
            ticket_no: map.ticket_no,
            ticket_action_description: map.ticket_action_description,
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


    const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/images/';


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

                {/* Site Selector */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">Site</h4>
                    <Select
                        onValueChange={(value) => setSelectedSite(value)}
                        disabled={!selectedCustomerId} // Disable if no customer is selected
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Site" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Show loading indicator if sites are loading */}
                            {sitesLoading ? (
                                <p>Loading sites...</p>
                            ) : (
                                sites.length > 0 ? (
                                    sites.map((site) => (
                                        <SelectItem key={site.site_id} value={`${site.site_id}`}>
                                            {site.site_name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <p>No sites available for this customer</p>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* SLA Status Selector */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">SLA Status</h4>
                    <Select onValueChange={(value) => setSelectedSlaStatus(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select SLA Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="breached">Breached </SelectItem>
                            <SelectItem value="within">Within</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Ticket Status Selector */}
                <div className="space-y-2">
                    <h4 className="text-base font-semibold">Ticket Status</h4>
                    <Select onValueChange={(value) => setSelectedTicketStatus(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Ticket Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=" ">New</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="monitoring">Monitoring</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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
                    {markers.map((marker) => (
                        <div
                            key={marker.id} //@ts-ignore
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
                            <h3 className="text-lg font-semibold">Ticket Details</h3>
                            <p><strong>Ticket No:</strong> {selectedTicket.ticket_no}</p>
                            <p><strong>Customer:</strong> {selectedTicket.customer_name}</p>
                            <p><strong>Job Card:</strong> {selectedTicket.service_title}</p>
                            <p><strong>Assigned To:</strong> {selectedTicket.user_name}</p>
                            <p><strong>Action:</strong> {selectedTicket.ticket_action_description}</p>
                            <p><strong>Updated At:</strong> {selectedTicket.ticket_update_time}</p>

                            {/*{*/}
                            {/*    "lat": "0.6146017",*/}
                            {/*    "lon": "34.9764433",*/}
                            {/*    "service_title": "Pole cracks",*/}
                            {/*    "ticket_service_image": "503eb734-405b-4588-87ef-8f627cd2342b6785801957709343624.jpg",*/}
                            {/*    "customer_name": "Bayobab",*/}
                            {/*    "ticket_no": "#4 MTN Patrol - 21st Jan- Webuye",*/}
                            {/*    "ticket_update_time": "2025-01-21 15:45:41",*/}
                            {/*    "ticket_action_description": "no faults ",*/}
                            {/*    "user_name": "Henry Ngeny"*/}
                            {/*}*/}
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

export default DistributionMap;

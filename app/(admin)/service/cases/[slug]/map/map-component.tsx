"use client";

import React, { useEffect, useState } from 'react';
// @ts-ignore
import GoogleMapReact from 'google-map-react';
import { usePathname } from 'next/navigation'; // For getting the ticket ID from the pathname
import { useSingleTicket } from "@/actions/get-ticket";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

// Replace with your API Key
const YOUR_API_KEY = "AIzaSyAO6CcKrA0n1XTgIR6VHe-5G7P0p2KenGY";

// Pin icon URL for the marker
const PIN_ICON = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

// Default coordinates when no data is available
const DEFAULT_CENTER = { lat: 0.1765, lng: 37.913 };

const calculateCenter = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
    if (points.length === 0) {
        return DEFAULT_CENTER; // Default center if no points
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

const MapComponent: React.FC = () => {
    const pathname = usePathname();
    const ticket_id = parseInt(pathname.replace('/service/cases/', ''));

    // Fetch map data for the specific ticket ID
    const { isLoading, error, data: MapData } = useSingleTicket('/maintenance/getMap', ticket_id);
    const maps = Array.isArray(MapData) ? MapData.reverse() : [];

    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [markers, setMarkers] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    useEffect(() => {
        // Prepare the map points with necessary data
        const mapPoints = maps.map((map) => ({
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lon),
            id: map.ticket_no,
            service_title: map.service_title,
            comment: map.ticket_action_description,
            image: map.ticket_service_image,
            customer_name: map.customer_name,
            ticket_update_time: map.ticket_update_time,
            user_name: map.user_name,
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

    const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/images/';


    // @ts-ignore
    return (
        <div className="space-y-6">
            {/* Map */}
            <div className="relative h-[60vh] w-[72vw]">
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
                            <p><strong>Ticket No:</strong> {selectedTicket.id}</p>
                            <p><strong>Customer:</strong> {selectedTicket.customer_name}</p>
                            <p><strong>Job Card:</strong> {selectedTicket.service_title}</p>
                            <p><strong>Assigned To:</strong> {selectedTicket.user_name}</p>
                            <p><strong>Comment:</strong> {selectedTicket.comment}</p>
                            <p><strong>Updated At:</strong> {selectedTicket.ticket_update_time}</p>
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

export default MapComponent;

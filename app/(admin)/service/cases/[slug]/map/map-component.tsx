"use client";

import React, { useEffect, useState } from 'react';
// Import from modern package entry point
import { Map, Marker } from 'react-map-gl/mapbox';
import { usePathname } from 'next/navigation';
import { useSingleTicket } from "@/actions/get-ticket";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Pin icon URL for the marker
const PIN_ICON = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

// Default coordinates when no data is available
const DEFAULT_CENTER = { lat: 0.1765, lng: 37.913 };

const calculateCenter = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
  if (points.length === 0) {
    return DEFAULT_CENTER;
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

  // Map viewport state setup
  const [viewport, setViewport] = useState({
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    zoom: 7
  });

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
      const newCenter = calculateCenter(mapPoints);
      setMarkers(mapPoints);
      setViewport(prev => ({
        ...prev,
        latitude: newCenter.lat,
        longitude: newCenter.lng
      }));
    } else {
      setViewport(prev => ({
        ...prev,
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng
      }));
    }
  }, [maps]);

  // Handle marker click to display ticket details
  const handleMarkerClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/images/';

  return (
    <div className="space-y-6">
      {/* Map Canvas Frame */}
      <div className="relative h-[60vh] w-[72vw] overflow-hidden rounded-lg border">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {markers.map((marker, index) => (
            <Marker
              key={marker.id || index}
              latitude={marker.lat}
              longitude={marker.lng}
              anchor="center"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Stop click maps propagation
                  handleMarkerClick(marker);
                }}
                className="cursor-pointer transition hover:scale-110"
              >
                <img src={PIN_ICON} alt="Pin" className="w-[30px] h-[30px]" />
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Ticket Details Panel */}
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
                          alt="reference attachment look layout preview"
                          className="w-52 h-64 object-cover hover:cursor-pointer rounded-md"
                        />
                      </DialogTrigger>
                    </div>
                    <DialogContent className="sm:max-w-[425px]">
                      <img
                        src={`${IMAGE}${selectedTicket.image}`}
                        alt="expanded target modal layout"
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

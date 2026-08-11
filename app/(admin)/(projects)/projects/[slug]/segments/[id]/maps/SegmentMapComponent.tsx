"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
// Import MapRef type to type-check our map control element securely
import { Map, Marker, MapRef } from 'react-map-gl/mapbox';
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComponentMap } from "@/actions/get-heatmap";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useSingleCustomer } from "@/actions/get-customer";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_LAT = 0.04626;
const DEFAULT_LNG = 37.65587;
const PIN_ICON = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
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
  if (!date) return "";
  //@ts-ignore
  return new Intl.DateTimeFormat("en-CA").format(date);
};

const SegmentMapComponent: React.FC = () => {
  // Use a map reference to command the camera directly, avoiding viewport sync state issues
  const mapRef = useRef<MapRef>(null);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const { data: clientData } = useFetchData('/customers');
  const clients = Array.isArray(clientData) ? clientData.reverse() : [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const projectsIndex = pathSegments.indexOf('projects');
  const segmentsIndex = pathSegments.indexOf('segments');

  const project_id = projectsIndex !== -1 ? parseInt(pathSegments[projectsIndex + 1]) : 0;
  const segment_id = segmentsIndex !== -1 ? parseInt(pathSegments[segmentsIndex + 1]) : 0;

  const { isLoading: serviceLoading, data: serviceData } = useSingleCustomer(
    "/radar/site/services",
    parseInt(selectedCustomerId || "0")
  );
  const services = Array.isArray(serviceData) ? serviceData.reverse() : [];
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const { data: heatmapData } = useComponentMap(
    '/segment_dashboard/getSegmentMap',
    formatDate(fromDate),
    formatDate(toDate),
    segment_id,
    selectedStatus || ''
  );

  const maps = Array.isArray(heatmapData) ? heatmapData.reverse() : [];

  const markers = useMemo(() => {
    return maps.map((map: any) => ({
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
  }, [maps]);

  // Imperative UI manipulation prevents component layout looping
  useEffect(() => {
    if (!mapRef.current) return;

    if (markers.length > 0) {
      const newCenter = calculateCenter(markers);
      mapRef.current.easeTo({
        center: [newCenter.lng, newCenter.lat],
        duration: 500
      });
    } else {
      mapRef.current.easeTo({
        center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
        duration: 500
      });
    }
  }, [markers]);

  const handleMarkerClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/projectImages/';

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="space-y-2">
          <h4 className="text-base font-semibold">From Date</h4>
          <DatePicker
            //@ts-ignore
            selected={fromDate}
            //@ts-ignore
            onChange={(date) => setFromDate(date)}
            placeholderText="From Date"
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-semibold">To Date</h4>
          <DatePicker
            //@ts-ignore
            selected={toDate}
            //@ts-ignore
            onChange={(date) => setToDate(date)}
            placeholderText="To Date"
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-semibold"> Status </h4>
          <Select onValueChange={(value) => {
            setSelectedCustomerId(value);
            setSelectedStatus(value);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Filter">Filter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Canvas Frame */}
      <div className="relative h-[80vh] w-[72vw] overflow-hidden rounded-lg border">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            latitude: DEFAULT_CENTER.lat,
            longitude: DEFAULT_CENTER.lng,
            zoom: 7
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              latitude={marker.lat}
              longitude={marker.lng}
              anchor="center"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
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

      {/* Segment Details */}
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
                          alt="uploaded target asset preview"
                          className="w-52 h-64 object-cover hover:cursor-pointer rounded-md"
                        />
                      </DialogTrigger>
                    </div>
                    <DialogContent className="sm:max-w-[425px]">
                      <img
                        src={`${IMAGE}${selectedTicket.image}`}
                        alt="expanded preview window modal"
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

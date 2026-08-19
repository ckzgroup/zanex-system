"use client"

import React, { useEffect, useMemo, useState } from "react";
// Import from fixed package entry point
import { Map, Marker } from 'react-map-gl/mapbox';
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDistributionMap } from "@/actions/get-heatmap";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useSingleCustomer } from "@/actions/get-customer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_LAT = 0.04626;
const DEFAULT_LNG = 37.65587;

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

const formatDate = (date: string | null): string => {
  if (!date) return "";
  //@ts-ignore
  return new Intl.DateTimeFormat("en-CA").format(date);
};

const DistributionMap: React.FC = () => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedSlaStatus, setSelectedSlaStatus] = useState<string | null>(null);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState<string | null>(null);

  // Map viewport state setup tracking
  const [viewport, setViewport] = useState({
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    zoom: 7
  });

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Fetch clients
  const { data: clientData } = useFetchData("/customers");
  const clients = Array.isArray(clientData) ? clientData.reverse() : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    client.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch Services based on the selected customer
  const { data: serviceData } = useSingleCustomer(
    "/radar/site/services",
    parseInt(selectedCustomerId || "0")
  );
  const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

  const [serviceSearchTerm, setServiceSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.service_name?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Fetch SITES based on the selected customer
  const { isLoading: sitesLoading, data: sitesData } = useSingleCustomer(
    "/radar/site/customer",
    parseInt(selectedCustomerId || "0")
  );
  const sites = Array.isArray(sitesData) ? sitesData.reverse() : [];

  // Fetch raw map distribution data by date range
  const { data: heatmapData } = useDistributionMap(
    "/maintenance/distributionMap",
    formatDate(fromDate),
    formatDate(toDate),
    '', // Fetching raw datasets so client-side memory filtering handles smooth transitions
    '',
    '',
    '',
    ''
  );

  const maps = Array.isArray(heatmapData) ? heatmapData.reverse() : [];

  // 1. In-memory filter with loose string conversion to prevent number/string mismatch bugs
  const filteredMaps = useMemo(() => {
    return maps.filter((map: any) => {
      const serviceMatch = selectedService
        ? String(map.service_type_id || map.service_id) === String(selectedService)
        : true;

      const customerMatch = selectedCustomerId
        ? String(map.customer_id) === String(selectedCustomerId)
        : true;

      const ticketStatusMatch = selectedTicketStatus
        ? map.ticket_status?.toString().trim() === selectedTicketStatus.trim()
        : true;

      const siteMatch = selectedSite
        ? String(map.site_id) === String(selectedSite)
        : true;

      const slaStatusMatch = selectedSlaStatus
        ? map.ticket_state?.toLowerCase() === selectedSlaStatus.toLowerCase()
        : true;

      return serviceMatch && customerMatch && ticketStatusMatch && siteMatch && slaStatusMatch;
    });
  }, [maps, selectedService, selectedCustomerId, selectedTicketStatus, selectedSite, selectedSlaStatus]);

  // 2. Pure memoized calculation for markers (avoids setState calls and prevents infinite re-render loops)
  const markers = useMemo(() => {
    return filteredMaps
      .filter((map: any) => !isNaN(parseFloat(map.lat)) && !isNaN(parseFloat(map.lon)))
      .map((map: any) => ({
        id: map.ticket_no || `${map.lat}-${map.lon}-${map.customer_id}`,
        lat: parseFloat(map.lat),
        lng: parseFloat(map.lon),
        service_title: map.service_title,
        comment: map.ticket_action_description,
        image: map.ticket_service_image,
        customer_name: map.customer_name,
        ticket_update_time: map.ticket_update_time,
        user_name: map.user_name,
        ticket_no: map.ticket_no,
        ticket_action_description: map.ticket_action_description,
      }));
  }, [filteredMaps]);

  // 3. Coordinate hash key triggers camera view updates only when marker positions actually shift
  const centerKey = useMemo(() => {
    return markers.map((m) => `${m.lat},${m.lng}`).join("|");
  }, [markers]);

  useEffect(() => {
    if (markers.length > 0) {
      const newCenter = calculateCenter(markers);
      setViewport((prev) => ({
        ...prev,
        latitude: newCenter.lat,
        longitude: newCenter.lng,
      }));
    } else {
      setViewport((prev) => ({
        ...prev,
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng,
      }));
    }
  }, [centerKey]);

  const handleMarkerClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const resetCustomFilters = () => {
    setSelectedCustomerId(null);
    setSelectedService(null);
    setSelectedSite(null);
    setSelectedTicketStatus(null);
    setSelectedSlaStatus(null);
    setSearchTerm("");
    setServiceSearchTerm("");
    setSelectedTicket(null);
  };

  const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/images/';

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Date Range Picker */}
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

        {/* Client Selector */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Customer</h4>
          <Select
            value={selectedCustomerId || ""}
            onValueChange={(value) => {
              setSelectedCustomerId(value);
              // Reset dependent sub-filters when customer changes
              setSelectedService(null);
              setSelectedSite(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Customer" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search Customer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              {filteredClients.map((client) => (
                <SelectItem key={client.customer_id} value={`${client.customer_id}`}>
                  {client.customer_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Selector */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Service</h4>
          <Select
            value={selectedService || ""}
            onValueChange={(value) => setSelectedService(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search Service"
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
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
            value={selectedSite || ""}
            onValueChange={(value) => setSelectedSite(value)}
            disabled={!selectedCustomerId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              {sitesLoading ? (
                <p className="p-2 text-sm text-muted-foreground">Loading sites...</p>
              ) : sites.length > 0 ? (
                sites.map((site) => (
                  <SelectItem key={site.site_id} value={`${site.site_id}`}>
                    {site.site_name}
                  </SelectItem>
                ))
              ) : (
                <p className="p-2 text-sm text-muted-foreground">No sites available</p>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* SLA Status Selector */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">SLA Status</h4>
          <Select
            value={selectedSlaStatus || ""}
            onValueChange={(value) => setSelectedSlaStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select SLA Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breached">Breached</SelectItem>
              <SelectItem value="within">Within</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ticket Status Selector */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Ticket Status</h4>
          <Select
            value={selectedTicketStatus || ""}
            onValueChange={(value) => setSelectedTicketStatus(value)}
          >
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

        {/* Reset Filter Action */}
        <div className="place-content-end">
          <button
            onClick={resetCustomFilters}
            className="px-4 py-2 mb-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[80vh] w-[72vw] overflow-hidden rounded-lg border">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {markers.map((marker) => (
            <Marker
              key={`${selectedCustomerId}-${selectedService}-${marker.id}`}
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
                          alt="uploaded reference preview"
                          className="w-52 h-64 object-cover hover:cursor-pointer rounded-md"
                        />
                      </DialogTrigger>
                    </div>
                    <DialogContent className="sm:max-w-[425px]">
                      <img
                        src={`${IMAGE}${selectedTicket.image}`}
                        alt="expanded view window"
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

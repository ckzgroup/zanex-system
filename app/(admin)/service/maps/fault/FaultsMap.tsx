"use client"

import React, {useEffect, useMemo, useState} from "react";
// @ts-ignore
import GoogleMapReact from "google-map-react";
import { format } from "date-fns";
import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import {useDistributionMap, useDistributionMapFilter, useHeatmap} from "@/actions/get-heatmap";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useSingleCustomer } from "@/actions/get-customer";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import useAuthStore from "@/hooks/use-user"; // Assume a date picker component is available

const YOUR_API_KEY = "AIzaSyAO6CcKrA0n1XTgIR6VHe-5G7P0p2KenGY";

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

const FaultsMap: React.FC = () => {
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | string | null>(null);
    const [selectedService, setSelectedService] = useState<number | string | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null); // Customer ID
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedSlaStatus, setSelectedSlaStatus] = useState<string | null>(null);
    const [selectedTicketStatus, setSelectedTicketStatus] = useState<string | null>(null);

    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [markers, setMarkers] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0.1765, lng: 37.913 }); // State for dynamic map center



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

  const company_id = useAuthStore((state) => state.user?.result.user_company_id);

  // Fetch heatmap data
  const { data: heatmapData } = useDistributionMapFilter(
    "/maintenance/faultsMap",     // @ts-ignore
    company_id,
    formatDate(fromDate),
    formatDate(toDate),
  );

  const maps = Array.isArray(heatmapData) ? heatmapData.reverse() : [];

  const filteredMaps = useMemo(() => {
    return maps.filter((map: any) => {
      const serviceMatch = selectedService ? map.service_type_id === parseInt(selectedService.toString()) : true;
      const customerMatch = selectedCustomerId ? map.customer_id === parseInt(selectedCustomerId.toString()) : true;
      const ticketStatusMatch = selectedTicketStatus ? map.ticket_status === selectedTicketStatus : true;
      const siteMatch = selectedSite ? map.site_id === parseInt(selectedSite.toString()) : true;
      const typeMatch = selectedType ? map.fault_type === parseInt(selectedType) : true;
      const slaStatusMatch = selectedSlaStatus ? map.ticket_state?.toLowerCase() === selectedSlaStatus.toLowerCase() : true;


      return serviceMatch && customerMatch && ticketStatusMatch && siteMatch && typeMatch && slaStatusMatch;
    });
  }, [maps, selectedService, selectedCustomerId, selectedTicketStatus, selectedSite, selectedSlaStatus]);




  useEffect(() => {
    // Prepare the map points with necessary data from nmaps
    const mapPoints = filteredMaps.map((map: any) => ({
      lat: parseFloat(map.lat),
      lng: parseFloat(map.lon),
      id: map.ticket_no,
      service_title: map.service_name, // Updated to match your new structure
      service_id: map.service_type_id,
      cause: map.fault_cause,
      type: map.fault_type,
      date: map.fault_create_date,
      comment: map.fault_description,
      customer_name: map.customer_name,
      customer_id: map.customer_id,
      ticket_update_time: map.ticket_actual_time,
      user_name: map.user_name,
      ticket_no: map.ticket_no,
      ticket_action_description: map.fault_description, // Adjusted field
      sla_status: map.ticket_state, // New: Might be useful for filtering
      ticket_status: map.ticket_status, // New: Might be useful for filtering
      site_name: map.site_name, // Include site name for reference
    }));

    // console.log("filteredMaps updated:", filteredMaps);
    // console.log("selectedCustomerId:", selectedCustomerId);
    // console.log("selectedService:", selectedService);
    // console.log("selectedSite:", selectedSite);
    // console.log("selectedTicketStatus:", selectedTicketStatus);
    // console.log("selectedSLA:", selectedSlaStatus);

    if (JSON.stringify(mapPoints) !== JSON.stringify(markers)) {
      setMarkers(mapPoints);
      setCenter(mapPoints.length > 0 ? calculateCenter(mapPoints) : DEFAULT_CENTER);
    }
  }, [filteredMaps]);



  // Handle marker click to display ticket details
    const handleMarkerClick = (ticket: any) => {
        setSelectedTicket(ticket);
    };

  const resetCustomFilters = () => {
    setSelectedCustomerId(null);
    setSelectedClient(null);
    setSelectedService(null);
    setSelectedSite(null);
    setSelectedTicketStatus(null);
    setSelectedSlaStatus(null);
    setSearchTerm("");
    setServiceSearchTerm("");
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

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-primary">Date Range</h2>

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
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-primary">Custom Filter</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {/* Client Selector */}
              <div className="space-y-2">
                <h4 className="text-base font-semibold">Customer</h4>
                <Select onValueChange={(value) => {
                  setSelectedCustomerId(value);
                  setSelectedClient(value);
                  setSelectedService(null); // reset service
                  setSelectedSite(null);    // reset site
                  setSelectedTicketStatus(null);
                  setSelectedSlaStatus(null);
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
                        // onClick={() => setSelectedCustomerId(selectedTicket.customer_id)}
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
                      <SelectItem
                        key={service.service_id}
                        value={`${service.service_id}`}
                      >
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

              {/* Fault Type Selector */}
              <div className="space-y-2">
                <h4 className="text-base font-semibold"> Fault Type </h4>
                <Select
                  onValueChange={(value) => setSelectedType(value)}
                  disabled={!selectedType} // Disable if no customer is selected
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Show loading indicator if sites are loading */}
                    {sitesLoading ? (
                      <p>Loading sites...</p>
                    ) : (
                      filteredMaps.length > 0 ? (
                        filteredMaps.map((i, index) => (
                          <SelectItem key={index} value={`${i.fault_type}`}>
                            {i.fault_type}
                          </SelectItem>
                        ))
                      ) : (
                        <p>No Fault Type</p>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Custom Filters Button */}
              <div className="place-content-end">
                <button
                  onClick={resetCustomFilters}
                  className="px-4 py-2 mb-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  Reset Filters
                </button>
              </div>
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
              {markers.map((marker: any, index: number) => (
                <div
                  key={marker.ticket_id || index} //@ts-ignore
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
                            <h3 className="text-lg font-semibold">Fault Details</h3>
                            <p><strong>Ticket No:</strong> {selectedTicket.ticket_no}</p>
                            <p><strong>Fault Type:</strong> {selectedTicket.type}</p>
                            <p><strong>Fault Cause:</strong> {selectedTicket.cause}</p>
                            <p><strong>Fault Date:</strong> {selectedTicket.date}</p>
                            <p><strong>Customer:</strong> {selectedTicket.customer_name}</p>
                            <p><strong>Service:</strong> {selectedTicket.service_title}</p>
                            <p><strong>Site:</strong> {selectedTicket.site_name}</p>
                            <p><strong>SLA Status:</strong> {selectedTicket.sla_status}</p>
                            <p><strong>Ticket Status:</strong> {selectedTicket.ticket_status}</p>
                            <p><strong>Comment:</strong> {selectedTicket.comment}</p>
                            <p><strong>Assigned To:</strong> {selectedTicket.user_name}</p>

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

export default FaultsMap;

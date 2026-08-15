"use client";

import React, { useState, useMemo } from 'react';
//  Updated explicit imports
import { Map, Source, Layer } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';

import useFetchData from "@/actions/use-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHeatmap } from "@/actions/get-heatmap";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useSingleCustomer } from "@/actions/get-customer";

// Replace with your Mapbox Public Access Token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_LAT = 0.04626;
const DEFAULT_LNG = 37.65587;

const formatDate = (date: string | null): string => {
  if (!date) return "";
  //@ts-ignore
  return new Intl.DateTimeFormat("en-CA").format(date);
};

// Mapbox Layer styling for the heatmap effect
const heatmapLayerStyle: LayerProps = {
  id: 'heatmap-layer',
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': 1,
    // Increase the heatmap color weight weight by zoom level
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 1,
      9, 3
    ],
    // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(33,102,172,0)',
      0.2, 'rgb(103,169,207)',
      0.4, 'rgb(209,229,240)',
      0.6, 'rgb(253,219,199)',
      0.8, 'rgb(239,138,98)',
      1, 'rgb(178,24,43)'
    ],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 2,
      9, 20
    ],
    'heatmap-opacity': 0.6
  }
};

const HeatmapComponent: React.FC = () => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | string | null>(null);
  const [selectedService, setSelectedService] = useState<number | string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Fetch clients and services
  const { data: clientData } = useFetchData('/customers');
  const clients = Array.isArray(clientData) ? clientData.reverse() : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch Service based on the selected customer
  const { data: serviceData } = useSingleCustomer(
    "/radar/site/services",
    parseInt(selectedCustomerId || "0")
  );
  const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

  const [serviceSearchTerm, setServiceSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Fetch heatmap data
  const { data: heatmapData } = useHeatmap(
    '/maintenance/getHeatMap',
    formatDate(fromDate),
    formatDate(toDate),
    selectedClient || '',
    selectedService || ''
  );

  // Format coordinates into GeoJSON format required by Mapbox
  const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = useMemo(() => {
    const points = Array.isArray(heatmapData) ? heatmapData : [];
    return {
      type: 'FeatureCollection',
      features: points.map((point) => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // Mapbox uses [longitude, latitude] ordering
          coordinates: [point.lon, point.lat],
        },
      })),
    };
  }, [heatmapData]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Date Range Pickers */}
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
          <Select onValueChange={(value) => {
            setSelectedCustomerId(value);
            setSelectedClient(value);
          }}>
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
                <SelectItem
                  key={client.customer_id}
                  value={`${client.customer_id}`}
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
      </div>

      {/* Mapbox Heatmap Container */}
      <div className="relative h-[80vh] w-[72vw] overflow-hidden rounded-lg">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LNG,
            zoom: 6.2
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {/* Render GeoJSON Source and Heatmap Layer */}
          <Source type="geojson" data={geojsonData}>
            <Layer {...heatmapLayerStyle} />
          </Source>
        </Map>
      </div>
    </div>
  );
};

export default HeatmapComponent;

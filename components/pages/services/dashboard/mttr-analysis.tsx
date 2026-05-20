"use client";

import { TooltipProps } from 'recharts';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useFetchData from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";
import {formatDate} from "@/utils/format-date";
import {Badge} from "@/components/ui/badge";

// Custom tooltip component
// @ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { hours, minutes } = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white p-2 border border-gray-300">
                <p className="label">{`Date: ${label}`}</p>
                <p>{`Hours: ${hours}`}</p>
                <p>{`Minutes: ${minutes}`}</p>
            </div>
        );
    }
    return null;
};

const MttrAnalysis = () => {
    const { isLoading, error, data } = useFetchData('/maintenance/mttr');
    const [selectedService, setSelectedService] = useState('All'); // Add a state for selected service

    const mttr = Array.isArray(data) ? data.reverse() : [];

    // Get unique service names for the filter dropdown
    // @ts-ignore
    const serviceNames = [...new Set(mttr.map(item => item.service_name))];

    // Prepare the chart data based on the selected service name
    const filteredData = selectedService === 'All'
        ? mttr
        : mttr.filter(item => item.service_name === selectedService);

    const graphData = filteredData.map((item : any) => ({
        name: item.service_name,
        date: formatDate(item.ticket_date),
        total: item.total_minutes,
        count: item.total_count,
        hold: item.total_hold_minutes,
        mttr: (item.total_minutes - item.total_hold_minutes) / item.total_count,
        hours: Math.floor(((item.total_minutes - item.total_hold_minutes) / item.total_count) / 60),
        minutes : Math.floor(((item.total_minutes - item.total_hold_minutes) / item.total_count) % 60)
    }));

    const handleServiceChange = (e : any) => {
        setSelectedService(e.target.value);
    };

    return (
        <div>
            {/* Service filter dropdown */}
            <div style={{ marginBottom: '20px' }} className="flex items-center justify-end p-2 ">
                <Badge className="text-white">
                    <div className="space-x-2">
                        <label htmlFor="service-filter" className="pl-5">Service Name: </label>
                        <select id="service-filter" value={selectedService} onChange={handleServiceChange} className="bg-transparent text-black border-none">
                            {serviceNames.map(service => (
                                <option key={service} value={service} className="focus:border-none selection:border-none">{service}</option>
                            ))}
                        </select>
                    </div>
                </Badge>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={400}
                    data={graphData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    {/* @ts-ignore*/}
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="hours" stroke="#F07D3D" fill="#F07D3D" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MttrAnalysis;

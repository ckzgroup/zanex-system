"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useFetchData from "@/actions/use-api";
import { startOfToday, startOfWeek, startOfMonth, isAfter } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

// Customized label rendering function
// @ts-ignore
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Custom Tooltip for displaying ticket count
// @ts-ignore
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p>{`Service: ${payload[0].name}`}</p>
                <p>{`Ticket Count: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const TrafficChart = () => {
    const { isLoading, error, data } = useFetchData('/maintenance/getTicketTraffic');
    const [filter, setFilter] = useState('Today'); // State to manage selected filter

    const traffic = Array.isArray(data) ? data.reverse() : [];

    // Get current dates for comparison
    const today = startOfToday();
    const weekStart = startOfWeek(new Date());
    const monthStart = startOfMonth(new Date());

    // Filter logic based on selected filter
    const filteredTraffic = traffic.filter((item) => {
        const ticketDate = new Date(item.ticket_date); // Convert to Date object
        if (filter === 'Today') {
            return isAfter(ticketDate, today);
        }
        if (filter === 'Weekly') {
            return isAfter(ticketDate, weekStart);
        }
        if (filter === 'Monthly') {
            return isAfter(ticketDate, monthStart);
        }
        return true; // Default case, no filter applied
    });

    // Group traffic data by service_name and sum up the ticket_count
    const groupedTraffic = filteredTraffic.reduce((acc, item) => {
        const serviceName = item.service_name;
        if (!acc[serviceName]) {
            acc[serviceName] = { name: serviceName, value: 0 };
        }
        acc[serviceName].value += item.ticket_count;
        return acc;
    }, {});

    const graphData = Object.values(groupedTraffic);

    return (
        <div>
            {/* Dropdown for filter selection */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="filterSelect">Select Time Range: </label>
                <select
                    id="filterSelect"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="Today">Today</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>

            {/* Check if graphData has data or not */}
            {graphData.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>No current data available</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={400} height={400}>
                        <Legend />
                        {/* Tooltip for displaying ticket count */}
                        {/* @ts-ignore*/}
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={graphData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {graphData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default TrafficChart;

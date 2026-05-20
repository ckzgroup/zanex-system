"use client";

import { TooltipProps } from 'recharts';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useFetchData from "@/actions/use-api";
import { formatDate } from "@/utils/format-date";
import { Badge } from "@/components/ui/badge";
import { addDays, addMonths, startOfWeek } from 'date-fns'; // date-fns for date manipulation

// Simplified Custom tooltip component
// @ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { total, breached } = payload[0].payload; // Access total and breached tickets
        return (
            <div className="custom-tooltip bg-white p-2 border border-gray-300">
                <p className="label">{`Customer: ${label}`}</p>
                <p>{`Total Tickets: ${total}`}</p>
                <p>{`Breached Tickets: ${breached}`}</p>
            </div>
        );
    }
    return null;
};

const BreachedAnalysis = () => {
    const { isLoading, error, data } = useFetchData('/maintenance/getBreachedAnalysis');
    const [dateFilter, setDateFilter] = useState('Daily');

    const mttr = Array.isArray(data) ? data.reverse() : [];

    // @ts-ignore
    const filterDataByDate = (mttr) => {
        const currentDate = new Date();

        switch (dateFilter) {
            case 'Daily': // @ts-ignore
                return mttr.filter(item => {
                    const ticketDate = new Date(item.ticket_date);
                    return ticketDate.toDateString() === currentDate.toDateString();
                });
            case 'Weekly':
                const startOfCurrentWeek = startOfWeek(currentDate); // @ts-ignore
                return mttr.filter(item => {
                    const ticketDate = new Date(item.ticket_date);
                    return ticketDate >= startOfCurrentWeek && ticketDate <= currentDate;
                });
            case 'Monthly':
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // @ts-ignore
                return mttr.filter(item => {
                    const ticketDate = new Date(item.ticket_date);
                    return ticketDate >= startOfMonth && ticketDate <= currentDate;
                });
            default:
                return mttr;
        }
    };

    const filteredData = filterDataByDate(mttr);

    const groupByCustomer = (data : any) => { // @ts-ignore
        const groupedData = data.reduce((acc, item) => {
            const customer = item.customer_name;
            if (!acc[customer]) {
                acc[customer] = {
                    customer: customer,
                    total: 0,
                    breached: 0,
                    hold: 0,
                    totalMinutes: 0,
                    totalCount: 0,
                };
            }
            acc[customer].total += item.total_tickets;
            acc[customer].breached += item.total_breached;
            acc[customer].hold += item.total_hold_minutes;
            acc[customer].totalMinutes += item.total_minutes;
            acc[customer].totalCount += item.total_count;
            return acc;
        }, {});

        return Object.values(groupedData).map((group : any) => ({
            name: group?.customer,
            total: group?.total,
            breached: group?.breached,
        }));
    };

    const graphData = groupByCustomer(filteredData);

    const handleDateFilterChange = (e : any) => {
        setDateFilter(e.target.value);
    };

    return (
        <div>
            {/* Date filter dropdown */}
            <div style={{ marginBottom: '20px' }} className="flex items-center justify-end p-2 ">
                <Badge className="text-white">
                    <div className="space-x-2">
                        <label htmlFor="date-filter" className="pl-5">Date Filter: </label>
                        <select id="date-filter" value={dateFilter} onChange={handleDateFilterChange} className="bg-transparent text-black border-none">
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </Badge>
            </div>

            {/* Chart */}

            {/* Check if graphData has data or not */}
            {graphData.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>No current data available</p>
                </div>
            ) : (
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="total" stroke="#2a9d8f" fill="#2a9d8f" />
                    <Area type="monotone" dataKey="breached" stroke="#dc3545 " fill="#dc3545 " />
                </AreaChart>
            </ResponsiveContainer>
            )}
        </div>
    );
};

export default BreachedAnalysis;

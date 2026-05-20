"use client"

import React, { useState, useEffect } from 'react';
import useFetchData from "@/actions/use-api";

interface Technician {
    agent_name: string;
    site_name: string;
    service_name: string;
    ticket_date: string;
    total_tickets: number;
    breached_tickets: number;
    total_minutes: number;
    total_hold_minutes: number;
}

const TechnicianTable: React.FC = () => {
    const { isLoading, error, data } = useFetchData('/maintenance/getTechnicianReport');
    const [selectedTechnician, setSelectedTechnician] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Technician[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10); // Limit default to 10 per page

    // Extract technicians list
    const technicians = Array.from(new Set(data?.map((item: Technician) => item.agent_name))) || [];


    // Automatically select the technician with the latest ticket when data loads
    useEffect(() => {
        if (data?.length) {
            const latestTicket = data.reduce((prev: Technician, current: Technician) => {
                return new Date(prev.ticket_date) > new Date(current.ticket_date) ? prev : current;
            });
            setSelectedTechnician(latestTicket.agent_name);
        }
    }, [data]);

    // Filter data by selected technician
    useEffect(() => {
        if (selectedTechnician) {
            const filtered = data?.filter((item: Technician) => item.agent_name === selectedTechnician) || [];
            setFilteredData(filtered);
            setCurrentPage(1); // Reset to the first page when a new technician is selected
        } else {
            setFilteredData([]);
        }
    }, [selectedTechnician, data]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const calculateAdherence = (totalTickets: number, breachedTickets: number) => {
        if (totalTickets === 0) return 0;
        return ((totalTickets - breachedTickets) / totalTickets) * 100;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className="p-4">
            <label htmlFor="technician" className="block mb-2">
                Select Technician
            </label>
            <select
                id="technician"
                className="border rounded p-2 mb-4"
                onChange={(e) => setSelectedTechnician(e.target.value)}
                value={selectedTechnician}
            >
                <option value="">--Select a Technician--</option>
                {technicians.map((tech) => ( // @ts-ignore
                    <option key={tech} value={tech}> {tech} </option>
                ))}
            </select>

            {/* Only show the table if a technician is selected */}
            {selectedTechnician && currentData.length > 0 ? (
                <>
                    <h2 className="text-lg font-semibold mb-4">
                        Data for Technician: {selectedTechnician}
                    </h2>

                    <table className="min-w-full bg-white border border-gray-300 rounded">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Technician Name</th>
                            <th className="border border-gray-300 px-4 py-2">Site Name</th>
                            <th className="border border-gray-300 px-4 py-2">Service Name</th>
                            <th className="border border-gray-300 px-4 py-2">Ticket Date</th>
                            <th className="border border-gray-300 px-4 py-2">Total Tickets</th>
                            <th className="border border-gray-300 px-4 py-2">Breached Tickets</th>
                            <th className="border border-gray-300 px-4 py-2">Total Minutes</th>
                            <th className="border border-gray-300 px-4 py-2">Total Hold Minutes</th>
                            <th className="border border-gray-300 px-4 py-2">Adherence (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentData.map((item) => (
                            <tr key={item.ticket_date}>
                                <td className="border border-gray-300 px-4 py-2">{item.agent_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.site_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.service_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.ticket_date}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.total_tickets}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.breached_tickets}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.total_minutes}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.total_hold_minutes}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calculateAdherence(item.total_tickets, item.breached_tickets).toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={handlePrevPage}
                            className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span>
              Page {currentPage} of {totalPages}
            </span>

                        <button
                            onClick={handleNextPage}
                            className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : selectedTechnician && currentData.length === 0 ? (
                <div className="mt-4 text-gray-500">No data available for the selected technician.</div>
            ) : (
                <div className="mt-4 text-gray-500">Please select a technician to view data.</div>
            )}
        </div>
    );
};

export default TechnicianTable;
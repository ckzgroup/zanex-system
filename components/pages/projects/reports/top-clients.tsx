import React from 'react';
import {Progress} from "@/components/ui/progress";
import useFetchData from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";

const invoices = [
    {
        name: "Safaricom",
        progress: 85,
        projects: 152,
    },
    {
        name: "Zuku",
        progress: 72,
        projects: 108,
    },

    {
        name: "Quavatel",
        progress: 66,
        projects: 89,
    },
    {
        name: "IQ Things",
        progress: 50,
        projects: 53,
    },

    {
        name: "Cello",
        progress: 38,
        projects: 42,
    },

]

function TopClients() {

    const { isLoading, error, data } = useFetchData('/project_report/topClients');
    const clients = Array.isArray(data) ? data.reverse() : [];

    return (
        <div className="space-y-4">
            {clients.map((item: any, index: number) => (
            <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">{item.customer_name}</h3>
                    <p><span className="text-primary font-bold">{item.project_count}</span> Projects</p>
                </div>
                <Progress className="h-4" value={item.project_count} indicatorColor="bg-primary"/>
            </div>
            ))}
        </div>
    );
}

export default TopClients;
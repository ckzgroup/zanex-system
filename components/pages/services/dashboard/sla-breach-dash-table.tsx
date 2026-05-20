import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Progress} from "@/components/ui/progress";
import {Ellipsis} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import useFetchData from "@/actions/use-api";



export default function SlaBreachDashTable() {

    const { isLoading, error, data } = useFetchData('/maintenance/getBreached');
    const slas = Array.isArray(data) ? data.reverse().slice(0, 10) : [];

    console.log(slas)

    return (
        <Table>
            <TableCaption>A list of breached SLAs.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead> Ticket No </TableHead>
                    <TableHead> Customer </TableHead>
                    <TableHead> SLA Time (Hrs) </TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Technicians</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {slas.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.ticket_no}</TableCell>
                        <TableCell>{item.customer_name}</TableCell>
                        <TableCell>{ item.sla_time_hrs }</TableCell>
                        <TableCell>{item.site_name}</TableCell>
                        <TableCell>{item.technician_names}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

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

const invoices = [
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },
    {
        no: 1,
        name: "Training Test 1",
        deadline: "2024-03-05",
        budget: 850000,
        spending: 370346,
        status: "Pending",
    },

]

export default function TopProjects() {
    return (
        <Table>
            <TableCaption>A list of your top projects.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spending</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.name}>
                        <TableCell className="font-medium">{invoice.no}</TableCell>
                        <TableCell className="font-medium">{invoice.name}</TableCell>
                        <TableCell>{invoice.deadline}</TableCell>
                        <TableCell>Ksh {invoice.budget}</TableCell>
                        <TableCell>Ksh {invoice.spending}</TableCell>
                        <TableCell>
                            <Badge>{invoice.status}</Badge>
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

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
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import React from "react";

export default function MaterialChangeTable() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment('/segment_dashboard/materialChangeList', segment_id)

    const materials = Array.isArray(data) ? data.reverse() : [];

    return (
        <Table>
            <TableCaption>A list of material change requests.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right"> Technician </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {materials.length > 0 ? (
                    materials.map((item) => (
                    <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.material_id}</TableCell>
                        <TableCell>{item.material_change_quantity}</TableCell>
                        <TableCell>{item.material_change_request_date}</TableCell>

                        <TableCell className="text-right">
                            <Badge
                                className="bg-primary border border-accent text-background hover:bg-accent hover:text-foreground"
                            >
                                <span>{item.requested_by}</span>
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <div className="pt-5 italic w-full">No Material Change available</div> // This is the empty state message
                )}
            </TableBody>
        </Table>
    )
}

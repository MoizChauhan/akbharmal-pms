"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const GlassTable = ({ data }: { data: any[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Range (mm)</TableHead>
                <TableHead>Price/SqFt</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.mmRange}</TableCell>
                    <TableCell>₹{item.pricePerSqFt}</TableCell>
                </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No records</TableCell></TableRow>}
        </TableBody>
    </Table>
);

export const AluminumTable = ({ data }: { data: any[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Build Type</TableHead>
                <TableHead>Constants</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.buildType}</TableCell>
                    <TableCell className="font-mono text-xs">
                        {JSON.stringify(item.constants)}
                    </TableCell>
                </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={2} className="text-center">No records</TableCell></TableRow>}
        </TableBody>
    </Table>
);

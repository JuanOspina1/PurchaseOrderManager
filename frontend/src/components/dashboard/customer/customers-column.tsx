import { CustomerData } from "@/types/customer.type";
import { ColumnDef } from "@tanstack/react-table";
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

export const customersColumn: ColumnDef<CustomerData>[] = [
    {
        accessorKey: "rowSelection",
        header: ({ table }) => {
            return (
                <>
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected()
                        }
                        indeterminate={
                            table.getIsSomePageRowsSelected()
                        }
                        onChange={(event) => {
                            table.toggleAllPageRowsSelected(!!event.target.checked)
                        }}
                    />
                </>
            )
        },
        cell: ({ row }) => (
            <>
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={(event) => {
                        row.toggleSelected(!!event.target.checked)
                    }}
                    aria-label="Select row"
                />
            </>
        ),
    },
    {
        accessorKey: "name",
        header: () => <p>Name</p>
    },
    {
        accessorKey: "city",
        header: () => <p>City</p>
    },
    {
        accessorKey: "address",
        header: () => <p>Location</p>
    },
    {
        accessorKey: "phone_number",
        header: () => <p>Phone</p>
    },
]
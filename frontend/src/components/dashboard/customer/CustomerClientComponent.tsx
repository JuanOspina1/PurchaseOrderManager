'use client';

import { access } from 'fs';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { X } from '@phosphor-icons/react/dist/ssr/X';

import { fetchCustomers } from '@/lib/fetchCustomers';
import { useUser } from '@/hooks/use-user';
import { CustomersAddForm } from '@/components/dashboard/customer/customers-addform';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { customersColumn } from './customers-column';
import { PaginationState } from '@tanstack/react-table';
import { PageMetadata } from '@/types/page-list';
import { useGetPaginatedCustomers } from '@/hooks/customers/useGetPaginatedCustomers';

interface Customer {
  id: string;
  name: string;
  address: string;
  zip_code: string;
  city: string;
  state: string;
  website: string;
  phone_number: string;
  customers: { id: string }[];
  _count: { customers: number };
}

const ClientComponent: React.FC = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const {data, isSuccess, isPending} = useGetPaginatedCustomers(pagination, "");
  const [toggleForm, setToggleForm] = React.useState(true);

  function handleCustomerForm() {
    setToggleForm(!toggleForm);
  }

  if (isPending) {
    return <p>Loading...</p>
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
        <div>
          {toggleForm ? (
            <Button
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={() => handleCustomerForm()}
            >
              Add
            </Button>
          ) : (
            <Button
              startIcon={<X fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={() => handleCustomerForm()}
            >
              Cancel
            </Button>
          )}
        </div>
      </Stack>
      {toggleForm ? <CustomersFilters /> : null}
      {toggleForm ? isSuccess && (
        <CustomersTable columns={customersColumn} data={data.data} pagination={pagination} setPagination={setPagination} pageMetadata={data.pageMetadata} />
      ) : (
        <CustomersAddForm  handleCustomerForm={handleCustomerForm} />
      )}
    </Stack>
  );
};

export default ClientComponent;

// function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }

// 'use client';

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// import { X } from '@phosphor-icons/react/dist/ssr/X';

// import { CustomersAddForm } from '@/components/dashboard/customer/customers-addform';
// import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
// import { CustomersTable } from '@/components/dashboard/customer/customers-table';

// interface Customer {
//   id: string;
//   name: string;
//   address: string;
//   zip_code: string;
//   city: string;
//   state: string;
//   website: string;
//   phone_number: string;
//   customers: { id: string }[];
//   _count: { customers: number };
// }

// interface ClientComponentProps {
//   customers: Customer[];
// }

// const ClientComponent: React.FC<ClientComponentProps> = ({ customers }) => {
//   const [toggleForm, setToggleForm] = React.useState(true);

//   const page = 0;
//   const rowsPerPage = 5;

//   const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

//   function handleCustomerForm() {
//     setToggleForm(!toggleForm);
//   }

//   return (
//     <Stack spacing={3}>
//       <Stack direction="row" spacing={3}>
//         <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
//           <Typography variant="h4">Customers</Typography>
//           {/* IMPORT EXPORT FUNCTIONALITY TO BE ADDED AT A FUTURE DATE */}
//           {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
//             <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
//               Import
//             </Button>
//             <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
//               Export
//             </Button>
//           </Stack> */}
//         </Stack>
//         <div>
//           {toggleForm ? (
//             <Button
//               startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
//               variant="contained"
//               onClick={() => handleCustomerForm()}
//             >
//               Add
//             </Button>
//           ) : (
//             <Button
//               startIcon={<X fontSize="var(--icon-fontSize-md)" />}
//               variant="contained"
//               onClick={() => handleCustomerForm()}
//             >
//               Cancel
//             </Button>
//           )}
//         </div>
//       </Stack>
//       {toggleForm ? <CustomersFilters /> : null}
//       {toggleForm ? (
//         <CustomersTable rows={paginatedCustomers} page={page} rowsPerPage={rowsPerPage} />
//       ) : (
//         <CustomersAddForm handleCustomerForm={handleCustomerForm} />
//       )}
//     </Stack>
//   );
// };

// export default ClientComponent;

// function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }

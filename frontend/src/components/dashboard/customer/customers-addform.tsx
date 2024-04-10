'use client';

import * as React from 'react';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

interface FormProps {
  handleCustomerForm: any;
}

export function CustomersAddForm({ handleCustomerForm }: FormProps): React.JSX.Element {
  function submitCustomer(event: React.FormEvent) {
    event.preventDefault();
    console.log('customer created');
    handleCustomerForm();
  }

  return (
    <Card>
      <Box
        component="form"
        onSubmit={(event) => submitCustomer(event)}
        sx={{
          '& .MuiTextField-root': { m: 3, width: '80%' },
          minWidth: '800px',
          overflowX: 'auto',
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField required id="outlined-required" label="Company Name" />
          <TextField required id="outlined-required" label="Street Address" />
          <TextField required id="outlined-required" label="State" />
          <TextField required id="outlined-required" label="Zip Code" />
          <TextField required id="outlined-required" label="Main Phone" />
          <TextField id="outlined-required" label="Website" />
          <Button variant="contained" type="submit" sx={{ m: 3, width: '25ch' }}>
            Create New Customer
          </Button>
        </div>
      </Box>
      <Divider />
    </Card>
  );
}

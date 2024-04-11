'use client';

import * as React from 'react';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Controller, DefaultValues, SubmitHandler, useForm } from 'react-hook-form';

interface FormProps {
  handleCustomerForm: any;
}

interface IFormData {
  companyName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mainPhone: string;
  website: string;
}

const defaultValues: DefaultValues<IFormData> = {
  companyName: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  mainPhone: '',
  website: '',
};

export function CustomersAddForm({ handleCustomerForm }: FormProps): React.JSX.Element {
  const { handleSubmit, control } = useForm<IFormData>({
    defaultValues,
  });

  const submitCustomer: SubmitHandler<IFormData> = (data) => {
    console.log(data);
    handleCustomerForm();
  };

  return (
    <Card>
      <Box
        component="form"
        onSubmit={handleSubmit(submitCustomer)}
        sx={{
          '& .MuiTextField-root': { m: 3, width: '80%' },
          minWidth: '800px',
          overflowX: 'auto',
        }}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="companyName"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Company Name" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="streetAddress"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Street Address" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="City" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="State" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="zipCode"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Zip Code" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="mainPhone"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Main Phone" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="website"
          render={({ field: { onChange } }) => <TextField id="outlined-required" label="Website" onChange={onChange} />}
        />

        <Button variant="contained" type="submit" sx={{ m: 3, width: '25ch' }}>
          Create New Customer
        </Button>
      </Box>
      <Divider />
    </Card>
  );
}

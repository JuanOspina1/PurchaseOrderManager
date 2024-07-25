'use client';

import * as React from 'react';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Controller, DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';

import { createCustomer } from '../../../lib/createCustomers';

import 'react-phone-number-input/style.css';

import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';

interface FormProps {
  handleCustomerForm: any;
  accessToken: string;
}

interface IFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  website: string;
}

const defaultValues: DefaultValues<IFormData> = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  phone_number: '',
  website: '',
};

export function CustomersAddForm({ handleCustomerForm, accessToken }: FormProps): React.JSX.Element {
  const { handleSubmit, control } = useForm<IFormData>({
    defaultValues,
  });

  const submitCustomer: SubmitHandler<IFormData> = (customerData) => {
    console.log(customerData);
    createCustomer(customerData, accessToken);
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
          name="name"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Company Name" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="address"
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
          name="zip_code"
          render={({ field: { onChange } }) => (
            <TextField required id="outlined-required" label="Zip Code" onChange={onChange} />
          )}
        />

        {/* WORKING ON PHONE VALIDATION OPTIONS */}
        {/* <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange } }) => (
            <TextField   
              required
              id="outlined-required"
              label="Main Phone"
              type="number"
              onChange={(event) => onChange(+event.target.value)}
            />
          )}
        /> */}
        {/* <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange } }) => <MuiTelInput required label="Main Phone" onChange={onChange} />}
        /> */}

        <Controller
          name="phone_number"
          control={control}
          rules={{ validate: (value) => matchIsValidTel(value) }}
          render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => (
            <MuiTelInput
              {...fieldProps}
              value={value ?? ''}
              inputRef={fieldRef}
              helperText={fieldState.invalid ? 'Tel is invalid' : ''}
              error={fieldState.invalid}
            />
          )}
        />
        {/* WORKING ON PHONE VALIDATION OPTIONS */}

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

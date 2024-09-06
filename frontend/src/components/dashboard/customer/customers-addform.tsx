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
import { z } from 'zod';
import { addCustomerSchema } from '@/schemas/customers/addCustomerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerInputType } from '@/types/customer.type';
import { useAddCustomer } from '@/hooks/customers/useAddCustomer';

interface FormProps {
  handleCustomerForm: any;
}

export function CustomersAddForm({ handleCustomerForm }: FormProps): React.JSX.Element {
  const { handleSubmit, register, control, formState: {errors}} = useForm<CustomerInputType>({
    resolver: zodResolver(addCustomerSchema)
  });
  const {mutate, isSuccess, isPending} = useAddCustomer();

  React.useEffect(() => {
    if(isSuccess) {
      handleCustomerForm();
    }
  }, [isSuccess])

  const submitCustomer: SubmitHandler<CustomerInputType> = (customerData) => {
    mutate(customerData)
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
        <TextField required id="outlined-required" label="Company Name" {...register("name")} />
        <TextField required id="outlined-required" label="Street Address" {...register("address")} />
        <TextField required id="outlined-required" label="City" {...register("city")} />
        <TextField required id="outlined-required" label="State" {...register("state")} />
        <TextField required id="outlined-required" label="Zip Code"{...register("zip_code")} />
        <Controller
          name="phone_number"
          control={control}
          rules={{ validate: (value) => matchIsValidTel(value) }}
          render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => {
            return (
              <MuiTelInput
                {...fieldProps}
                value={value ?? ''}
                inputRef={fieldRef}
                helperText={fieldState.invalid ? 'Tel is invalid' : ''}
                error={fieldState.invalid}
              />
            )
          }
        }/>
      <TextField id="outlined-required" label="Website" {...register("website")} />

        <Button variant="contained" type="submit" sx={{ m: 3, width: '25ch' }}>
          {isPending ? "Loading..." : "Create New Customer" }
        </Button>
      </Box>
      <Divider />
    </Card>
  );
}

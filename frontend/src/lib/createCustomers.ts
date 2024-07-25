import axios from 'axios';

interface CustomerData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  website: string;
}

// interface CustomerData {
//   name: string;
//   streetAddress: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   mainPhone: string;
//   website: string;
// }

export async function createCustomer(
  //   customerCompanyId: string,
  customerData: CustomerData,
  accessToken: string
): Promise<any> {
  try {
    // Define the URL for the request
    const url = `http://localhost:5000/customer_company/`;

    // Make the POST request
    const response = await axios.post(url, customerData, {
      headers: {
        'Content-Type': 'application/json',
        // Include any authentication tokens or other necessary headers here
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Log the response data
    console.log('Customer created successfully:', response.data);

    // Return the response data
    return response.data;
  } catch (error: any) {
    // Handle errors
    console.error('Error creating customer:', error.response ? error.response.data : error.message);
    throw error;
  }
}

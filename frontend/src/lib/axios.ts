import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

export default axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
  })
 
// axios instance with authentication support
export const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
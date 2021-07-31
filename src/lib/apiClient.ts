import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const headers = {
  'x-api-key': process.env.API_KEY,
};

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers,
});

export default instance;

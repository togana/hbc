import axios from 'axios';

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await axios.get<T>(url);
  return res.data;
};

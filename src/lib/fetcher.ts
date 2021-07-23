import axios from 'axios';

export const fetcher = async (url: string): Promise<T> => {
  const res = await axios.get<T>(url);
  return res.data;
};

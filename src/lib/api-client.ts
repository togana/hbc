import { ApiError } from './errors';

const headers = {
  'x-api-key': process.env.API_KEY ?? '',
};

const baseURL = process.env.BASE_URL ?? '';

type RequestOptions = {
  params?: Record<string, string | number | undefined>;
};

export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<{ data: T }> {
    const url = new URL(path, baseURL);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
      );
    }

    const data = await response.json();
    return { data };
  },
};

export default apiClient;

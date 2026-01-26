import axios, { AxiosHeaders } from "axios";


export interface ApiResponse<T = unknown> {
  message: string;
  status: number;
  success: boolean;
  data?: T;
  error?: string;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true,
});

const GET = async <T>(endPoint: string) => {
  const response = await axiosClient.get<ApiResponse<T>>(endPoint);

  if (!response.data.success) {
    throw new Error(response.data.error);
  }

  return response.data;
};

const POST = async <T, D = unknown>(endPoint: string, data: D) => {
  const response = await axiosClient.post<ApiResponse<T>>(endPoint, data);

  if (!response.data.success) {
    throw new Error(response.data.error);
  }

  return response.data;
};

const API = async <T = unknown, D = unknown>(
  endPoint: string,
  data: D,
  method: string,
  headers: AxiosHeaders
) => {
  const response = await axiosClient<ApiResponse<T>>({
    method,
    url: endPoint,
    headers,
    data,
  });

  if (!response.data.success) {
    throw new Error(response.data.error);
  }

  return response.data;
};

export { API, axiosClient, GET, POST };


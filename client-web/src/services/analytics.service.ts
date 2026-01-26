import type { ApiResponse } from "@/utils/api";
import type {
  BasicAnalyticsType,
  CategoryDistributionType,
  MonthlyAnalysisType,
} from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${import.meta.env.VITE_API_URL}/analytics` ||
      `http://localhost:4000/api/analytics`,
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getBasicAnalytics: builder.query<ApiResponse<BasicAnalyticsType>, string>({
      query: (id) => `/basic/${id}`,
      providesTags: ["Analytics"],
    }),
    getMonthlyAnalytics: builder.query<
      ApiResponse<MonthlyAnalysisType>,
      string
    >({
      query: (id) => `/monthly/${id}`,
      providesTags: ["Analytics"],
    }),
    getCategoryDistribution: builder.query<
      ApiResponse<CategoryDistributionType[]>,
      string
    >({
      query: (id) => `/category/${id}`,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetBasicAnalyticsQuery,
  useGetMonthlyAnalyticsQuery,
  useGetCategoryDistributionQuery,
} = analyticsApi;

export default analyticsApi;

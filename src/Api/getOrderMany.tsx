///order-many
import { pause } from "@/utils/pause";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const getOderMoneyApi = createApi({
  reducerPath: "OrderMany",
  tagTypes: ["OrderMany"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8088/api",
    fetchFn: async (...args) => {
      await pause(300);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getOderMoney: builder.query<any, any>({
      query: ({ startDate, endDate }: any) => ({
        url: `/order-many`,
        method: "GET",
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      }),
      providesTags: ["OrderMany"],
    }),
  }),
});

export const { useGetOderMoneyQuery } = getOderMoneyApi;
export const getOderMoneyReducer = getOderMoneyApi.reducer;
export default getOderMoneyApi;

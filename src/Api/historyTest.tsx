import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HistoryTestData } from '@/interface/historyTest';
const HistoryTestApi = createApi({
    reducerPath: 'history-test',
    tagTypes: ['HistoryTest'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getHistoryTest: builder.query<HistoryTestData, { lessonId: number | string; userId: number | string }>({
            query: ({ lessonId, userId }) => `/history-test/${lessonId}/${userId}`,
            providesTags: ['HistoryTest']
        }),

        addHistoryTest: builder.mutation<HistoryTestData, HistoryTestData>({
            query: (data) => ({
                url: `/history-test/save`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['HistoryTest']
        }),

    })
});

export const {
    useAddHistoryTestMutation,
    useGetHistoryTestQuery,

} = HistoryTestApi;
export const HistoryReducer = HistoryTestApi.reducer;
export default HistoryTestApi;
import { Quizz } from '@/interface/quizzs';
import { pause } from '@/utils/pause';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const quizzApi = createApi({
    reducerPath: 'quizz',
    tagTypes: ['Quizz'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getQuizzs: builder.query<Quizz, void>({
            query: () => `/quizz`,
            providesTags: ['Quizz']
        }),
        getQuizzById: builder.query<Quizz, number | string>({
            query: (_id) => `/quizz/${_id}`,
            providesTags: ['Quizz']
        }),
        removeQuizz: builder.mutation<void, number>({
            query: (_id) => ({
                url: `/quizz/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Quizz']
        }),
        addQuizz: builder.mutation<Quizz, Quizz>({
            query: (quizz) => ({
                url: `/quizz`,
                method: "POST",
                body: quizz
            }),
            invalidatesTags: ['Quizz']
        }),
      
        updateQuizz: builder.mutation<Quizz, Quizz>({
            query: (quizz) => ({
                url: `/quizz/${quizz._id}`,
                method: "PUT",
                body: quizz
            }),
            invalidatesTags: ['Quizz']
        })
    })
});

export const {
    useAddQuizzMutation,
    useGetQuizzByIdQuery,
    useGetQuizzsQuery,
    useUpdateQuizzMutation,
    useRemoveQuizzMutation
} = quizzApi;
export const quizzReducer = quizzApi.reducer;
export default quizzApi;
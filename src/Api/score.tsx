import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ScoreData } from '@/interface/score';
import { string } from 'yup';
const ScoreApi = createApi({
    reducerPath: 'score',
    tagTypes: ['Score'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getScores: builder.query<ScoreData, void>({
            query: () => `/saveScore`,
            providesTags: ['Score']
        }),
        getScoreForprogress: builder.query<ScoreData,number|string>({
            query: (progressId) => `/saveScoreForprogress/${progressId}`,
            providesTags: ['Score']
        }),
        getScoreById: builder.query<ScoreData, number | string>({
            query: (_id) => `/saveScore/${_id}`,
            providesTags: ['Score']
        }),
      
        addScore: builder.mutation<ScoreData, ScoreData>({
            query: (score) => ({
                url: `/saveScore`,
                method: "POST",
                body: score
            }),
            invalidatesTags: ['Score']
        }),
        updateStatus: builder.mutation<ScoreData, { id: number | string, statusVideo: string }>({
            query: ({ id, statusVideo }) => ({
              url: `/saveScore/${id}`,
              method: "PUT",
              body: { statusVideo } // Chỉ truyền trường dữ liệu bạn muốn cập nhật
            }),
            invalidatesTags: ['Score']
          })
    })
});

export const {
   useAddScoreMutation,
   useGetScoreByIdQuery,
   useGetScoresQuery,
   useUpdateStatusMutation,
   useGetScoreForprogressQuery
} = ScoreApi;
export const ScoreReducer = ScoreApi.reducer;
export default ScoreApi;
import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IComment , ICommentApiResponse} from '@/interface/comment'
const commentApi = createApi({
    reducerPath: 'comment',
    tagTypes: ['Comment'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getComments: builder.query<ICommentApiResponse, void>({
            query: () => `/comment`,
            providesTags: ['Comment']
        }),
        getCommentById: builder.query<IComment, number | string>({
            query: (_id) => `/comment/${_id}`,
            providesTags: ['Comment']
        }),
        removeComment: builder.mutation<void, { commentId: number, hidden: boolean }>({
            query: ({ commentId, hidden }) => ({
                url: `/comment/${commentId}`,
                method: "DELETE",
                data: { hidden: hidden },
            }),
            invalidatesTags: ['Comment'],
        }),
        addComment: builder.mutation<IComment, IComment>({
            query: (comment) => ({
                url: `/comment`,
                method: "POST",
                body: comment
            }),
            invalidatesTags: ['Comment']
        }),
        updateCommentHidden: builder.mutation<void, { commentId: string; hidden: boolean }>({
            query: ({ commentId, hidden }) => ({
                url: `/comment/${commentId}`,
                method: 'PUT',
                body: { hidden }, 
            }),
            
        }),
    })
});

export const {
   useAddCommentMutation,
   useGetCommentByIdQuery,
   useGetCommentsQuery,
   useUpdateCommentHiddenMutation,
   useRemoveCommentMutation
} = commentApi;
export const commentReducer = commentApi.reducer;
export default commentApi;
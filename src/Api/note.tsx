import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INote, INoteApiResponse } from '@/interface/note'
const noteApi = createApi({
    reducerPath: 'note',
    tagTypes: ['Note'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getNotes: builder.query<INoteApiResponse, void>({
            query: () => `/note`,
            providesTags: ['Note']
        }),
        getNoteById: builder.query<INote, number | string>({
            query: (_id) => `/note/${_id}`,
            providesTags: ['Note']
        }),
        removeNote: builder.mutation<void, number>({
            query: (_id) => ({
                url: `/note/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Note'],
        }),
        addNote: builder.mutation<INote, INote>({
            query: (note) => ({
                url: `/note`,
                method: "POST",
                body: note
            }),
            invalidatesTags: ['Note']
        }),
        updateNote: builder.mutation<INote, INote>({
            query: (note) => ({
                url: `/note/${note._id}`,
                method: "PUT",
                body: note
            }),
            invalidatesTags: ['Note']
        })
    })
});

export const {
    useGetNotesQuery,
    useGetNoteByIdQuery,
    useRemoveNoteMutation,
    useAddNoteMutation,
    useUpdateNoteMutation
} = noteApi;
export const noteReducer = noteApi.reducer;
export default noteApi;
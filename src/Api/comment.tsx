import { pause } from "@/utils/pause";
import { Category, CategoryApiResponse } from "@/interface/categorys";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const comment2Api = createApi({
  reducerPath: "commentp",
  tagTypes: ["Comment2"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8088/api",
    fetchFn: async (...args) => {
      await pause(300);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getCommentCourse: builder.query<any, any>({
      query: (id) => `/get-comment/${id}`,
      providesTags: ["Comment2"],
    }),
    createComment: builder.mutation<any, any>({
      query: ({ name, idUser, idCourse, parentId }: any) => ({
        url: `/create-comment`,
        method: "POST",
        body: {
          name: name,
          idUser: idUser,
          idCourse: idCourse,
          parentId: parentId || undefined,
        },
      }),
      invalidatesTags: ["Comment2"],
    }),
    // updateCategory: builder.mutation<Category, Category>({
    //     query: (category) => ({
    //         url: `/category/${category._id}`,
    //         method: "PUT",
    //         body: category
    //     }),
    //     invalidatesTags: ['Comment']
    // })
  }),
});

export const { useGetCommentCourseQuery , useCreateCommentMutation} = comment2Api;
export const comment2Reducer = comment2Api.reducer;
export default comment2Api;

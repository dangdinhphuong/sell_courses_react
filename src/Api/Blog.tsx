import { IProductApiResponseBlog } from '@/interface/Blog';

import { IBlog } from '@/interface/Blog';
import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BlogApi = createApi({
    reducerPath: 'blog',
    tagTypes: ['Blog'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        GetAllBlog: builder.query<IProductApiResponseBlog, void>({
            query: () => `/blog`,
            providesTags: ['Blog']
        }),
        GetOneBlog: builder.query<IBlog, number | string>({
            query: (_id) => `/blog/${_id}`,
            providesTags: ['Blog']
        }),
        DeleteBlog: builder.mutation<void, number>({
            query: (_id) => ({
                url: `/blog/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Blog']
        }),
        addBlog: builder.mutation<IBlog, IBlog>({
            query: (blog) => ({
                url: `/blog`,
                method: "POST",
                body: blog
            }),
            invalidatesTags: ['Blog']
        }),
 
        updateBlog: builder.mutation<IBlog, { blog: IBlog; formData: FormData }>({
            query: ({ blog, formData }) => ({
              url: `/blog/${blog._id}`,
              method: "PUT",
              body: formData, // Sử dụng formData làm nội dung yêu cầu
            }),
            invalidatesTags: ['Blog']
          })
        
    })

});

export const {
    useDeleteBlogMutation,
    useGetAllBlogQuery,
    useGetOneBlogQuery,
    useUpdateBlogMutation,
    useAddBlogMutation
} = BlogApi;
export const BlogReducer = BlogApi.reducer;
export default BlogApi;
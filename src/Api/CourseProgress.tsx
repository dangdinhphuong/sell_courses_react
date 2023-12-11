import { CourseProgress, CourseProgress_id } from '@/interface/courseProgress';
import { pause } from '@/utils/pause';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const courseprogressApi = createApi({
    reducerPath: 'courseprogress',
    tagTypes: ['Courseprogress'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8088/api",
        fetchFn: async (...args) => {
            await pause(300);
            return fetch(...args);
        }
    }),
    endpoints: (builder) => ({
        getCourseprogress: builder.query<CourseProgress, void>({
            query: () => `/courseprogress`,
            providesTags: ['Courseprogress']
        }),
        getCourseprogressById: builder.query<CourseProgress,{productId:number | string;userId:number | string}>({
            query: ({productId,userId}) => `/courseprogress/${productId}/${userId}`,
            providesTags: ['Courseprogress']
        }),
        getProgressById: builder.query<CourseProgress_id, number | string>({
            query: (_id) => `/courseprogress/${_id}`,
            providesTags: ['Courseprogress']
        }),
        removeCourseprogress: builder.mutation<void, number>({
            query: (_id) => ({
                url: `/courseprogress/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Courseprogress']
        }),
        checkCourseAndReturnMessage: builder.query<string,{ productId: number | string; userId: number | string }>({
            query: ({ productId, userId }) => `/coursestatus/${productId}/${userId}`,
            providesTags: []
          }),

        addCourseprogress: builder.mutation<CourseProgress, CourseProgress>({
            query: (courseprogress) => ({
                url: `/courseprogress`,
                method: "POST",
                body: courseprogress
            }),
            invalidatesTags: ['Courseprogress']
        }),
      
        updateCourseprogress: builder.mutation<CourseProgress,  { id: number | string, progress: number }>({
            query: ({ id, progress }) => ({
                url: `/courseprogress/${id}`,
                method: "PUT",
                body: {progress}
            }),
            invalidatesTags: ['Courseprogress']
        }),
        submitScore: builder.mutation<{ success: boolean }, { score: number, lessonName: string, status: string }>({
            query: (data) => ({
              url: `/saveScore`,
              method: 'POST',
              body: data
            }),
          }),
    
    })
});

export const {
   useAddCourseprogressMutation,
   useGetCourseprogressQuery,
   useGetCourseprogressByIdQuery,
   useGetProgressByIdQuery,
   useRemoveCourseprogressMutation,
   useUpdateCourseprogressMutation,
   useCheckCourseAndReturnMessageQuery,
   useSubmitScoreMutation
} = courseprogressApi;
export const courseprogressReducer = courseprogressApi.reducer;
export default courseprogressApi;
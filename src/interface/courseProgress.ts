export interface CourseProgress {
    _id: string;
    productId:string|number;
    userId: string;
    progress: number;
  }
  export interface CourseProgress_id {
    data: CourseProgress
  }
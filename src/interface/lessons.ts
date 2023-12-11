import { Quiz, Quizz } from "./quizzs";
export interface Lesson{
    _id?:number|string,
    name: string,
    video:string,
    videotime:number,
    quizzs:any,
    productId:string|number,
}
export interface LessonData {
    data: {
      quizzs: Quiz[];
    };
  }
  export interface LessonData_id {
    data: Lesson
  }
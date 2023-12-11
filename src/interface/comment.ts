export interface IComment {
    _id?: string; 
    productId: number ;
    lessonId: number;
    comment: string | number; 
    userId: string; // Thêm thuộc tính userId với kiểu dữ liệu phù hợp
    hidden?: boolean
}

export interface ICommentApiResponse {
    data: IComment[]; 
    message: string;
}
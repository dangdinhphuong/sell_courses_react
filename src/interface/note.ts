export interface INote {
    _id?: string;
    content: string;
    
}

export interface INoteApiResponse {
    data?: INote[] | undefined;
    message: string;
}
interface IUserId {
  _id: string | number;
  name?: string;
  email?: string;
  img?: string;
  description?: string | number
}
export interface IBlog{
  _id? : string | number ,
  name: string ,
  img :string,
  userId: IUserId;
  imgUser: string;
  nameUser: string;
  description: string | number;
  language: string

}
export interface IProductApiResponseBlog {
  message: string;
  data : IBlog[]
}
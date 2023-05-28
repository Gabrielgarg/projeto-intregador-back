import z from "zod"
import { CommentModel } from "../../models/Posts"
export interface CreateCommentInputDTO {
    content:string,
    postId: string,
    token:string
}

export interface CreateCommentOutputDTO {
  message: string
}

export const CreateCommentSchema = z.object({
  // creator_id: z.string().min(1),
  content: z.string().min(1),
  postId: z.string().min(1),
  token: z.string().min(1)
}).transform(data => data as CreateCommentInputDTO )

export interface GetCommentInputDTO {
  id: string,//id do commentario
  token:string //id do post e id do criado
}

export type GetCommentOutputDTO = CommentModel[]

export const GetCommentSchema = z.object({
  id: z.string().min(1),
  token: z.string().min(1)
}).transform(data => data as GetCommentInputDTO)
import z from "zod"
import { PostModel } from "../../models/Posts"

export interface LikeDislikePostsInputDTO {
  like: boolean,
  dislike: boolean,
  token: string,
  id: string
}
export interface LikeDislikePostsOutputDTO {
    message: string
}

export const LikeDislikePostsSchema = z.object({
  like: z.boolean().optional(),
  dislike: z.boolean().optional(),
  token: z.string().min(1),
  id: z.any()
}).transform(data => data as LikeDislikePostsInputDTO)
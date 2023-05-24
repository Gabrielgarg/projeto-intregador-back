import z from "zod"
// import { PostModel } from "../../models/Posts"

// export interface LikeDislikePostsInputDTO {
//   like: boolean,
//   dislike: boolean,
//   token: string,
//   id: string
// }
// export interface LikeDislikePostsOutputDTO {
//     message: string
// }

// export const LikeDislikePostsSchema = z.object({
//   like: z.boolean().optional(),
//   dislike: z.boolean().optional(),
//   token: z.string().min(1),
//   id: z.any()
// }).transform(data => data as LikeDislikePostsInputDTO)

//aqui

export interface LikeOrDislikePlaylistInputDTO {
  playlistId: string,
  token: string,
  like: boolean
}

export type LikeOrDislikePlaylistOutputDTO = undefined

export const LikeOrDislikePlaylistSchema = z.object({
  playlistId: z.string().min(1),
  token: z.string().min(1),
  like: z.boolean()
}).transform(data => data as LikeOrDislikePlaylistInputDTO)

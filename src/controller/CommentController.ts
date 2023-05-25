import { ZodError } from "zod"
import { CreateCommentSchema, GetCommentSchema } from "../dtos/post/Comment.dto"
import { BaseError } from "../errors/BaseError"
import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { LikeOrDislikePlaylistSchema } from "../dtos/post/likeDislikesPost.dto"

export class CommentController {
    constructor(
      private commentBussines: CommentBusiness
    ) { }
    public getComments = async (req: Request, res: Response) => {
        try {
          const input = GetCommentSchema.parse({
            id: req.params.id,
            token: req.headers.authorization
          })
    
          const output = await this.commentBussines.getComments(input)
    
          res.status(200).send(output)
        } catch (error) {
          console.log(error)
    
          if (error instanceof ZodError) {
            res.status(400).send(error.issues)
          } else if (error instanceof BaseError) {
            res.status(error.statusCode).send(error.message)
          } else {
            res.status(500).send("Erro inesperado")
          }
        }
      }
    
    public createComment = async (req: Request, res: Response) => {
        try {
          const input = CreateCommentSchema.parse({
            // creator_id: req.body.creatorId,
            content: req.body.content,
            postId:req.body.postId,
            token: req.headers.authorization
          })
    
          const output = await this.commentBussines.createComment(input)
    
          res.status(201).send(output)
        } catch (error) {
          console.log(error)
    
          if (error instanceof ZodError) {
            res.status(400).send(error.issues)
          } else if (error instanceof BaseError) {
            res.status(error.statusCode).send(error.message)
          } else {
            res.status(500).send("Erro inesperado")
          }
        }
      }
      public likeOrDislikePlaylist = async (req: Request, res: Response) => {
        try {
          const input = LikeOrDislikePlaylistSchema.parse({
            token: req.headers.authorization,
            postId: req.params.id,
            like: req.body.like
          })
    
          const output = await this.commentBussines.likeOrDislikePlaylist(input)
    
          res.status(200).send(output)
          
        } catch (error) {
          console.log(error)
    
          if (error instanceof ZodError) {
            res.status(400).send(error.issues)
          } else if (error instanceof BaseError) {
            res.status(error.statusCode).send(error.message)
          } else {
            res.status(500).send("Erro inesperado")
          }
        }
      }
}
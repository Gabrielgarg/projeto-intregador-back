import { CommentDatabase } from "../database/CommentsDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO, GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/post/Comment.dto";
import { LikeOrDislikePlaylistInputDTO, LikeOrDislikePlaylistOutputDTO } from "../dtos/post/likeDislikesPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/Unauthorized";
import { Comment, CommentDB, CommentModel, LikeDislikeDB, LikeDislikeDBComment, PLAYLIST_LIKES } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
    constructor(
      private userDatabase: UserDatabase,
      private postDatabase: PostDatabase,
      private commentDatabase: CommentDatabase,
      private idGenerator: IdGenerator,
      private tokenManager: TokenManager
    ) { }

    public getComments = async (
        input: GetCommentInputDTO
      ): Promise<GetCommentOutputDTO> => {
        const { id, token } = input
        //q = id do post
        //token = token dos dados da pessoa que ta logada
    
        const payload = this.tokenManager.getPayload(token)
    
        if(payload === null){
          throw new BadRequestError("Token inválido")
        }
    
        // if(payload.role !== USER_ROLES.ADMIN){
        //   throw new BadRequestError("Somente admins tem acesso a esses dados.")
        // }
    
        const postsDB = await this.postDatabase.findPostById(id)

        if(!postsDB){
            throw new NotFoundError("'post' não encontrado")
        }

        // const commentDB = await this.commentDatabase.findCommentById(id)

        // if(!commentDB){
        //     throw new NotFoundError("'comentário' não encontrado")
        // }
        const commentsDB = await this.commentDatabase.findallcomments(id)

        if(!commentsDB){
            throw new NotFoundError("'comentário' não encontrado")
        }
        console.log(commentsDB)
        

        const comments = commentsDB.map((commentDB) => {
            const comment = new Comment(
                commentDB.id,
                commentDB.creator_id,
                commentDB.post_id,
                commentDB.content,
                commentDB.likes,
                commentDB.dislikes,
                commentDB.created_at,
                commentDB.update_at
            )
      
            return comment.commenttoBusinessModel()
          })

        return comments
    }
    


    public createComment = async (
        input: CreateCommentInputDTO
      ): Promise<CreateCommentOutputDTO> => {
        //token do usuario
        const { content, token, postId } = input
    
        const payload = this.tokenManager.getPayload(token)
        //tenho id do usuario logado
    
        if(payload === null){
            throw new BadRequestError("Token inválido")
          }
      
    
        let likes = 0
        let dislikes = 0
    
        console.log(this)
        const id = this.idGenerator.generate()
    
    
        const newComment = new Comment(
          id,
          payload.id,
          postId,
          content,
          likes,
          dislikes,
          new Date().toISOString(),
          new Date().toISOString()
        )
    
        const newCommentDB = newComment.commenttoDBModel()
        await this.commentDatabase.insertPost(newCommentDB) 
    
        // modelagem do payload do token
        // const tokenPayloadPost: TokenPayloadPost = {
        //   id: newPost.getId(),
        //   creator_id: newPost.getCreator()
        // }
    
    
        // // criação do token
        // const novotoken = this.tokenManager.createTokenPost(tokenPayloadPost)
    
        const output: CreateCommentOutputDTO = {
          message: "Cadastro realizado com sucesso",
        }
    
        return output
      }
      public likeOrDislikePlaylist = async (
        input: LikeOrDislikePlaylistInputDTO
      ): Promise<LikeOrDislikePlaylistOutputDTO> => {
        const { token, like, postId } = input
    
        const payload = this.tokenManager.getPayload(token)
    
        if (!payload) {
          throw new UnauthorizedError()
        }
    
        const userDB =
          await this.userDatabase.findUserById(payload.id)
    
    
        if (!userDB) {
          throw new NotFoundError("Usuário não encontrado")
        }
    
        const postDB =
          await this.commentDatabase.findCommentById(postId)
    
    
        if (!postDB) {
          throw new NotFoundError("Esse post não existe")
        }
    
        const playlist = new Comment(
          postDB.id,
          postDB.creator_id,
          postDB.post_id,
          postDB.content,
          postDB.likes,
          postDB.dislikes,
          postDB.created_at,
          postDB.update_at,
        )
    
        const likeSQlite = like ? 1 : 0
    
        const likeDislikeDB: LikeDislikeDBComment = {
          user_id: payload.id,
          comment_id: postId,
          like: likeSQlite
        }
    
        const likeDislikeExists =
          await this.commentDatabase.findLikeDislike(likeDislikeDB)
    
        if (likeDislikeExists === PLAYLIST_LIKES.ALREADY_LIKED) {
          if (like) {
            await this.commentDatabase.removeLikeDislike(likeDislikeDB)
            playlist.removeLike()
          } else {
            await this.commentDatabase.updateLikeDislike(likeDislikeDB)
            playlist.removeLike()
            playlist.addDislike()
          }
    
        } else if (likeDislikeExists === PLAYLIST_LIKES.ALREADY_DISLIKED) {
          if (like === false) {
            await this.commentDatabase.removeLikeDislike(likeDislikeDB)
            playlist.removeDislike()
          } else {
            await this.commentDatabase.updateLikeDislike(likeDislikeDB)
            playlist.removeDislike()
            playlist.addLike()
          }
    
        } else {
    
          await this.commentDatabase.insertLikeDislike(likeDislikeDB)
          like ? playlist.addLike() : playlist.addDislike()
        }
    
        const updatedPlaylistDB = playlist.commenttoDBModel()
        await this.commentDatabase.updatePlaylist(updatedPlaylistDB)
    
        const output: LikeOrDislikePlaylistOutputDTO = undefined
    
        console.log(playlist)
    
        return output
      }
}
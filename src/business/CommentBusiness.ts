import { CommentDatabase } from "../database/CommentsDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO, GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/post/Comment.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment, CommentDB, CommentModel } from "../models/Posts";
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
}
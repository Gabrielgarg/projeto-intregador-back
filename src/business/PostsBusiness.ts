import { PostDatabase } from "../database/PostsDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/post/createPost.dto"
import { DeletePostsInputDTO, DeletePostsOutputDTO } from "../dtos/post/deletePost.dto"
import { EditPostsInputDTO, EditPostsOutputDTO } from "../dtos/post/editPost.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto"
import { LikeDislikePostsInputDTO, LikeDislikePostsOutputDTO } from "../dtos/post/likeDislikesPost.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Like} from "../models/LikeDislike"
import { Post, PostDB, TokenPayloadPost } from "../models/Posts"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class PostBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { q, token } = input

    const payload = this.tokenManager.getPayload(token)

    if(payload === null){
      throw new BadRequestError("Token inválido")
    }

    // if(payload.role !== USER_ROLES.ADMIN){
    //   throw new BadRequestError("Somente admins tem acesso a esses dados.")
    // }

    const postsDB = await this.postDatabase.findPosts(q)

    const posts = postsDB.map((postDB) => {
      const post = new Post(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.update_at
      )

      return post.toBusinessModel()
    })

    const output: GetPostsOutputDTO = posts

    return output
  }

  public createPost = async (
    input: CreatePostsInputDTO
  ): Promise<CreatePostsOutputDTO> => {
    //token do usuario
    const { content, token } = input

    const payload = this.tokenManager.getPayloadPost(token)

    if(payload === null){
        throw new BadRequestError("Token inválido")
      }
  

    let likes = 0
    let dislikes = 0

    console.log(this)
    const id = this.idGenerator.generate()


    const newPost = new Post(
      id,
      payload.id,
      content,
      likes,
      dislikes,
      new Date().toISOString(),
      new Date().toISOString()
    )

    const newPostDB = newPost.toDBModel()
    await this.postDatabase.insertPost(newPostDB)

    // modelagem do payload do token
    const tokenPayloadPost: TokenPayloadPost = {
      id: newPost.getId(),
      creator_id: newPost.getCreator()
    }


    // // criação do token
    const novotoken = this.tokenManager.createTokenPost(tokenPayloadPost)

    const output: CreatePostsOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token: novotoken
    }

    return output
  }

  public editPost = async (
    input: EditPostsInputDTO
  ): Promise<EditPostsOutputDTO> => {
    const { content, token } = input

    const payload = this.tokenManager.getPayloadPost(token)

    if(payload === null){
        throw new BadRequestError("Token inválido")
      }

    // const userDB = await this.userDatabase.findUserByEmail(email)
    const postDB = await this.postDatabase.findPostById(payload.id)
    // const postDB = await this.postDatabase.editPost(payload.creator_id)

    if (!postDB) {
      throw new NotFoundError("'post' não encontrado")
    }

    if(payload.creator_id !== postDB.creator_id){
        throw new NotFoundError("criador do post inválido")
    }

    const post = new Post(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.update_at
      )

      const updatedPostDB: PostDB = {
        id: post.getId() || postDB.id,
        creator_id: post.getCreator() || postDB.creator_id,
        content: content || postDB.content,
        likes: post.getLikes() || postDB.likes,
        dislikes: post.getDislike() || postDB.dislikes,
        created_at: post.getCreatedAt() || postDB.created_at,
        update_at: post.getUpdateAt() || postDB.update_at
      }

      const output = {
        message: "Post editado com sucesso",
      }

      await this.postDatabase.editPost(postDB.id, updatedPostDB)

    return output
  }

  public deletePost = async (
    input: DeletePostsInputDTO
  ): Promise<DeletePostsOutputDTO> => {
    const { q, token } = input

    const payload = this.tokenManager.getPayloadPost(token)
    
    if(payload === null){
        throw new BadRequestError("Token inválido")
    }

    const userDB = await this.userDatabase.findUserById(q)
    
    const postDB = await this.postDatabase.findPostById(payload.id)
    
    if (!postDB) {
      throw new NotFoundError("'post' não encontrado")
    }
    
    if(userDB?.role === "ADMIN" || userDB?.id === payload.creator_id){
      const output = {
        message: "Post apagado com sucesso",
    }
        await this.postDatabase.deletePost(payload.id)

        return output
    }
    else{
      throw new NotFoundError("Você não pode apagar esse post")
    }

  }
  public likedislikePost = async (
    input: LikeDislikePostsInputDTO
  ): Promise<LikeDislikePostsOutputDTO> => {
    const { like, dislike, token, id } = input

    const payload = this.tokenManager.getPayload(token)

    if(payload === null){
        throw new BadRequestError("Token inválido")
    }

    const postDB = await this.postDatabase.findPostById(id)

    if (!postDB) {
        throw new NotFoundError("'post' não encontrado")
      }

    if(postDB?.creator_id === payload.id){
        throw new BadRequestError("O criador não pode dar like ou dislike")
    }

    if(like){

      console.log("to no like")

      
      const jadeulike = await this.postDatabase.likedislikebyid(payload.id, postDB.id)
      
      if(jadeulike?.like === 1){
        throw new NotFoundError("Já deu like no post")
      }
      const contadordolikedotabelalikedislike = 1

        // await this.postDatabase.likedislike()
        const newLikeDislike = new Like(
          payload.id,
          postDB.id,
          contadordolikedotabelalikedislike
        )

        //////////->>> Parei aqui
        // const newLikeDB = {
        //   newLikeDislike.payload.id,
        //   newLikeDislike.postDB.id,
        //   newLikeDislike.contadordolikedotabelalikedislike
        //   newLikeDislike.
        // }

        // = newLikeDislike.liketoDBModel

        // await this.postDatabase.insertlikedislike(newLikeDB)

        postDB.likes = postDB.likes + 1
          const post = new Post(
              postDB.id,
              postDB.creator_id,
              postDB.content,
              postDB.likes,
              postDB.dislikes,
              postDB.created_at,
              postDB.update_at
            )
      
            const updatedPostDB: PostDB = {
              id: post.getId() || postDB.id,
              creator_id: post.getCreator() || postDB.creator_id,
              content: post.getContent() || postDB.content,
              likes:  postDB.likes || post.getLikes(),
              dislikes: post.getDislike() || postDB.dislikes,
              created_at: post.getCreatedAt() || postDB.created_at,
              update_at: post.getUpdateAt() || postDB.update_at
            }
  
      const output = {
          message: "Like efetuado com sucesso!",
        }
  
        await this.postDatabase.like(postDB.id, updatedPostDB)
  
      return output

    }
    if(dislike){

      console.log("to no dislike")
      postDB.likes = postDB.likes - 1
      const post = new Post(
          postDB.id,
          postDB.creator_id,
          postDB.content,
          postDB.likes,
          postDB.dislikes,
          postDB.created_at,
          postDB.update_at
        )
  
        const updatedPostDB: PostDB = {
          id: post.getId() || postDB.id,
          creator_id: post.getCreator() || postDB.creator_id,
          content: post.getContent() || postDB.content,
          likes:  postDB.likes || post.getLikes(),
          dislikes: post.getDislike() || postDB.dislikes,
          created_at: post.getCreatedAt() || postDB.created_at,
          update_at: post.getUpdateAt() || postDB.update_at
        }

  const output = {
      message: "Dislike efetuado com sucesso!",
    }

    await this.postDatabase.dislike(postDB.id, updatedPostDB)

  return output
  }

    else{
        throw new BadRequestError("Entradas inválidas.")
    }
  }
}
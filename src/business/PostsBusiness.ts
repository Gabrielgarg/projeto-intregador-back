import { PostDatabase } from "../database/PostsDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/post/createPost.dto"
import { DeletePostsInputDTO, DeletePostsOutputDTO } from "../dtos/post/deletePost.dto"
import { EditPostsInputDTO, EditPostsOutputDTO } from "../dtos/post/editPost.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto"
import {  LikeOrDislikePlaylistInputDTO, LikeOrDislikePlaylistOutputDTO } from "../dtos/post/likeDislikesPost.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/Unauthorized"
import { Like} from "../models/LikeDislike"
import { LikeDislikeDB, PLAYLIST_LIKES, Post, PostDB, TokenPayloadPost } from "../models/Posts"
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

  //aqui

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
      await this.postDatabase.findPostById(postId)


    if (!postDB) {
      throw new NotFoundError("playlist com essa id não existe")
    }

    const playlist = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.update_at,
    )

    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.postDatabase.findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === PLAYLIST_LIKES.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB)
        playlist.removeLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB)
        playlist.removeLike()
        playlist.addDislike()
      }

    } else if (likeDislikeExists === PLAYLIST_LIKES.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB)
        playlist.removeDislike()
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB)
        playlist.removeDislike()
        playlist.addLike()
      }

    } else {

      await this.postDatabase.insertLikeDislike(likeDislikeDB)
      like ? playlist.addLike() : playlist.addDislike()
    }

    const updatedPlaylistDB = playlist.toDBModel()
    await this.postDatabase.updatePlaylist(updatedPlaylistDB)

    const output: LikeOrDislikePlaylistOutputDTO = undefined

    console.log(playlist)

    return output
  }
}
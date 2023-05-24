import { LikeDislikeDB } from "../models/LikeDislike";
import { PLAYLIST_LIKES, PostDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKE_DISLIKE = "likes_dislikes"

  //find post by id
  public async findPosts(
    q: string | undefined
  ): Promise<PostDB[]> {
    let postsDB

    if (q) {
      const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({id:q})

      postsDB = result
    } else {
      const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)

      postsDB = result
    }

    return postsDB
  }

  public async findPostById(
    id: string
  ): Promise<PostDB | undefined> {
    const [postDB]: PostDB[] | undefined[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .where({ id })

    return postDB
  }
 

  public async insertPost(
    newPostDB: PostDB
  ): Promise<void> {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(newPostDB)
  }
  

  public async editPost(id:string, newPostDB : PostDB):Promise<void>{
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(newPostDB).where({id})
  }

  public async deletePost(id:string):Promise<void>{
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({id})
  }

  public async like(id: string, newPostDB:PostDB):Promise<void>{
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(newPostDB).where({id})
  }

    public async dislike(id: string, newPostDB:PostDB):Promise<void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(newPostDB).where({id})
  }

  public async likedislikebyid(userid: string, postid:string,):Promise<LikeDislikeDB | undefined>{
    const [likedislikeDB]:LikeDislikeDB []|undefined[] = await BaseDatabase.connection(PostDatabase.TABLE_LIKE_DISLIKE).where("user_id", "=", `%${userid}%`).andWhere("post_id", "=", `%${postid}%`)

    return likedislikeDB
  }

  public async insertlikedislike(newLikeDislikeDB: LikeDislikeDB):Promise<void>{
    await BaseDatabase.connection(PostDatabase.TABLE_LIKE_DISLIKE).insert(newLikeDislikeDB)
  }

  //aqui

  public updatePlaylist = async (
    playlistDB: PostDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .update(playlistDB)
      .where({ id: playlistDB.id })
  }

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<PLAYLIST_LIKES | undefined> => {

    const [result]: Array<LikeDislikeDB | undefined> = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKE_DISLIKE)
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })

    if (result === undefined) {
      return undefined

    } else if (result.like === 1) {
      return PLAYLIST_LIKES.ALREADY_LIKED
      
    } else {
      return PLAYLIST_LIKES.ALREADY_DISLIKED
    }
  }

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKE_DISLIKE)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKE_DISLIKE)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKE_DISLIKE)
      .insert(likeDislikeDB)
  }

}
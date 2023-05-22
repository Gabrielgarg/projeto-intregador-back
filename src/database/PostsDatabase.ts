import { LikeDislikeDB } from "../models/LikeDislike";
import { PostDB } from "../models/Posts";
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

}
import { CommentDB, LikeDislikeDBComment, PLAYLIST_LIKES } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";


export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENT = "comment"
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKE_DISLIKE = "likes_dislikes_comment"

    public async insertPost(
        newCommentDB: CommentDB
      ): Promise<void> {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_COMMENT)
          .insert(newCommentDB)
      }
      
      public async findCommentById(id: string): Promise<CommentDB> {

        const [comment] = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT).select().where({[`${CommentDatabase.TABLE_COMMENT}.id`]:id})

        return comment

        // return commentDB
    }

      public async findallcomments(id: string): Promise<CommentDB[]> {

        const commentList: CommentDB[] = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT).select().where({[`${CommentDatabase.TABLE_COMMENT}.post_id`]:id})

        return commentList

        // return commentDB
    }

    public updatePlaylist = async (
        playlistDB: CommentDB
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_COMMENT)
          .update(playlistDB)
          .where({ id: playlistDB.id })
      }
    
      public findLikeDislike = async (
        likeDislikeDB: LikeDislikeDBComment
      ): Promise<PLAYLIST_LIKES | undefined> => {
    
        const [result]: Array<LikeDislikeDBComment | undefined> = await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKE_DISLIKE)
          .select()
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
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
        likeDislikeDB: LikeDislikeDBComment
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKE_DISLIKE)
          .delete()
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
          })
      }
    
      public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDBComment
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKE_DISLIKE)
          .update(likeDislikeDB)
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
          })
      }
    
      public insertLikeDislike = async (
        likeDislikeDB: LikeDislikeDBComment
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKE_DISLIKE)
          .insert(likeDislikeDB)
      }
      
}
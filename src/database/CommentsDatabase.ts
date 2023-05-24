import { CommentDB, CommentModel } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase } from "./PostsDatabase";
import { UserDatabase } from "./UserDatabase";


export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENT = "comment"
    public static TABLE_POSTS = "posts"


    // .select(
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.id`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.creator_id`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.name`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.likes`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.dislikes`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.created_at`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.updated_at`,
    //     `${UserDatabase.TABLE_USERS}.name as creator_name`
    //   )
    //   .join(
    //     `${UserDatabase.TABLE_USERS}`,
    //     `${PlaylistDatabase.TABLE_PLAYLISTS}.creator_id`, 
    //     "=",
    //     `${UserDatabase.TABLE_USERS}.id`
    //   )
    //   .where({ [`${PlaylistDatabase.TABLE_PLAYLISTS}.id`]: id })

    public async findCommentById(id: string): Promise<CommentModel | undefined> {
        // const [commentDB]: CommentDB[] | undefined[] = await BaseDatabase
        // .connection(CommentDatabase.TABLE_COMMENT)
        // .where({ id })
        //id = id do post

        const [commentList] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select(
            `${PostDatabase.TABLE_POSTS}.id as id_do_post`,
            `${PostDatabase.TABLE_POSTS}.creator_id as id_do_criador`,
            `${PostDatabase.TABLE_POSTS}.content as frase`,
            `${CommentDatabase.TABLE_COMMENT}.content as frase_do_comment`,
            `${CommentDatabase.TABLE_COMMENT}.id as id_do_comment`,
            `${CommentDatabase.TABLE_COMMENT}.creator_id as criador_do_comentario`
        ).innerJoin(`${CommentDatabase.TABLE_COMMENT}`, `${PostDatabase.TABLE_POSTS}.id`, "=", `${CommentDatabase.TABLE_COMMENT}.post_id`).where({[`${PostDatabase.TABLE_POSTS}.id`]:id})

        // const commentlist = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select(`${PostDatabase.TABLE_POSTS}.id`,
        // `${PostDatabase.TABLE_POSTS}.creator_id`, `${PostDatabase.TABLE_POSTS}.content`, `${CommentDatabase.TABLE_COMMENT}.id as comment_id`).innerJoin(`${CommentDatabase.TABLE_COMMENT}` )

        // const [postwithcomments] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select().join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`).where({[`${PostDatabase.TABLE_POSTS}`]:id})

        // const commentList = await db.select(*).form("comment").innerJoin("posts", "comment.post_id", "=", "posts.id").where({"post.id": idrecebido})

        // const todoOpost = await db.select(*).from("posts").innerJoin("users", "posts.creator_id", "=", "users.id").where({"post.id":idrecebido})

        return commentList as CommentModel | undefined

        // return commentDB
    }

    public async insertPost(
        newCommentDB: CommentDB
      ): Promise<void> {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_COMMENT)
          .insert(newCommentDB)
      }

      public async findallcomments(id: string): Promise<CommentDB[]> {

        const commentList: CommentDB[] = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT).select().where({[`${CommentDatabase.TABLE_COMMENT}.post_id`]:id})

        return commentList

        // return commentDB
    }
      
}
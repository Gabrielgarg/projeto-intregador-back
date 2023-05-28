import express from "express"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { PostDatabase } from "../database/PostsDatabase"
import { PostBusiness } from "../business/PostsBusiness"
import { PostController } from "../controller/PostsController"
import { UserDatabase } from "../database/UserDatabase"
import { CommentController } from "../controller/CommentController"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDatabase } from "../database/CommentsDatabase"


export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new UserDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)
const commentController = new CommentController(
    new CommentBusiness(
        new UserDatabase(),
        new PostDatabase(),
        new CommentDatabase,
        new IdGenerator(),
        new TokenManager()
    )
)


postRouter.get("/getpost", postController.getPosts)
postRouter.post("/createpost", postController.createPost)
postRouter.put("/editpost/:id", postController.editPost)
postRouter.delete("/deletepost/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeOrDislikePlaylist)
postRouter.get("/:id/getpost/comments", commentController.getComments)
postRouter.post("/getpost/createcomment", commentController.createComment)
postRouter.put("/:id/like/comment", commentController.likeOrDislikePlaylist)

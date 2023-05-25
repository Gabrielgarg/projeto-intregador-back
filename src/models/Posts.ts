export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    update_at: string
  }

  export interface CommentDB {
    id: string,
    creator_id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    update_at: string
  }

  export interface Comments_PostDB {
    comment_id: string,
    post_id:string
    
  }
  export interface CommentModel {
    id: string,
    creatorId: string,
    postId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updateAt: string
  }

  export interface Comments_PostModel {
    commentId: string,
    postId:string
  }
  
  export interface PostModel {
    id: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updateAt: string
  }

  export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
  }

  export interface LikeDislikeDBComment {
    user_id: string,
    comment_id: string,
    like: number
  }
  
  export enum PLAYLIST_LIKES {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
  }
  
  export interface TokenPayloadPost {
    id: string,
    creator_id: string
  }
  
  export class Comment {    
    constructor(
      private id: string,
      private creatorId: string,
      private postId: string,
      private content: string,
      private likes: number,
      private dislikes: number,
      private createdAt: string,
      private updateAt: string
    ) {}

    public getId(): string {
        return this.id
    }
    
    public setId(value: string): void {
        this.id = value
    }

    public getPostId(): string {
      return this.postId
  }
  
  public setPostId(value: string): void {
      this.postId = value
  }

    public getCreator(): string {
        return this.creatorId
    }

    public setCreator(value: string): void {
        this.creatorId = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike = (): void => {
      this.likes++
    }
  
    public removeLike = (): void => {
      this.likes--
    }

    public getDislike(): number {
        return this.dislikes
    }

    public setDislike(value: number): void {
        this.dislikes = value
    }

    public addDislike = (): void => {
      this.dislikes++
    }
  
    public removeDislike = (): void => {
      this.dislikes--
    }
    public getUpdateAt(): string {
      return this.updateAt
  }

  public setUpdateAt(value: string): void {
      this.updateAt = value
  }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public commenttoDBModel(): CommentDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            update_at: this.updateAt,
            created_at: this.createdAt
        }
    }

    public commenttoBusinessModel(): CommentModel {
        return {
            id: this.id,
            creatorId: this.creatorId,
            postId: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            updateAt: this.updateAt,
            createdAt: this.createdAt
        }
    }
}
  export class Post {    
      constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updateAt: string
      ) {}
  
      public getId(): string {
          return this.id
      }
      
      public setId(value: string): void {
          this.id = value
      }
  
      public getCreator(): string {
          return this.creatorId
      }
  
      public setCreator(value: string): void {
          this.creatorId = value
      }
  
      public getContent(): string {
          return this.content
      }
  
      public setContent(value: string): void {
          this.content = value
      }
  
      public getLikes(): number {
          return this.likes
      }
  
      public setLikes(value: number): void {
          this.likes = value
      }

      public addLike = (): void => {
        this.likes++
      }
    
      public removeLike = (): void => {
        this.likes--
      }
  
      public getDislike(): number {
          return this.dislikes
      }
  
      public setDislike(value: number): void {
          this.dislikes = value
      }

      public addDislike = (): void => {
        this.dislikes++
      }
    
      public removeDislike = (): void => {
        this.dislikes--
      }
      public getUpdateAt(): string {
        return this.updateAt
    }

    public setUpdateAt(value: string): void {
        this.updateAt = value
    }
  
      public getCreatedAt(): string {
          return this.createdAt
      }
  
      public setCreatedAt(value: string): void {
          this.createdAt = value
      }
  
      public toDBModel(): PostDB {
          return {
              id: this.id,
              creator_id: this.creatorId,
              content: this.content,
              likes: this.likes,
              dislikes: this.dislikes,
              update_at: this.updateAt,
              created_at: this.createdAt
          }
      }
  
      public toBusinessModel(): PostModel {
          return {
              id: this.id,
              creatorId: this.creatorId,
              content: this.content,
              likes: this.likes,
              dislikes: this.dislikes,
              updateAt: this.updateAt,
              createdAt: this.createdAt
          }
      }
  }
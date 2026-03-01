// import { QueryFilter, Types } from "mongoose";
// import { IPost, IPostComment, PostModel } from "../models/post.model";

// export interface IPostRepository {
//   create(post: IPost): Promise<IPost>;
//   findById(id: string): Promise<IPost | null>;
//   update(id: string, data: Partial<IPost>): Promise<IPost | null>;
//   addLike(id: string, userId: string): Promise<IPost | null>;
//   addComment(id: string, comment: IPostComment): Promise<IPost | null>;
//   removeComment(id: string, commentId: string): Promise<IPost | null>;
//   findAll({
//     page,
//     size
//   }: {
//     page: number;
//     size: number;
//   }): Promise<{ posts: IPost[]; total: number }>;
//   delete(id: string): Promise<boolean>;
// }

// export class PostRepository implements IPostRepository {

//   async create(post: IPost): Promise<IPost> {
//     const newPost = new PostModel(post);
//     return await newPost.save();
//   }

//   async findById(id: string): Promise<IPost | null> {
//     return await PostModel.findById(id)
//     //   .populate("authorId", "firstName lastName email profileUrl profileImage");
//     .populate("comments.userId", "firstName lastName username profileUrl profileImage")

//   }

//   async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
//     return await PostModel.findByIdAndUpdate(id, data, { new: true })
//     //   .populate("authorId", "firstName lastName email profileUrl profileImage");
//     .populate("comments.userId", "firstName lastName username profileUrl profileImage")

//   }

//   async addLike(id: string, userId: string): Promise<IPost | null> {
//     return await PostModel.findByIdAndUpdate(
//       id,
//       { $addToSet: { likes: new Types.ObjectId(userId) } },
//       { new: true }
//     // ).populate("authorId", "firstName lastName email profileUrl profileImage");
//     ).populate("comments.userId", "firstName lastName username profileUrl profileImage")

//   }

//   async addComment(id: string, comment: IPostComment): Promise<IPost | null> {
//     return await PostModel.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           comments: {
//             userId: new Types.ObjectId(comment.userId.toString()),
//             text: comment.text,
//             createdAt: new Date()
//           }
//         },
//         $inc: { commentsCount: 1 }
//       },
//       { new: true }
//     ).populate("authorId", "firstName lastName email profileUrl profileImage");
//   }

//   async removeComment(id: string, commentId: string): Promise<IPost | null> {
//     return await PostModel.findOneAndUpdate(
//       { _id: id, "comments._id": new Types.ObjectId(commentId) },
//       {
//         $pull: { comments: { _id: new Types.ObjectId(commentId) } },
//         $inc: { commentsCount: -1 }
//       },
//       { new: true }
//     ).populate("authorId", "firstName lastName email profileUrl profileImage");
//   }

//   async findAll({ page, size }: { page: number; size: number })
//     : Promise<{ posts: IPost[]; total: number }> {

//     const filter: QueryFilter<IPost> = {};

//     const [posts, total] = await Promise.all([
//       PostModel.find(filter)
//         .sort({ createdAt: -1 }) // newest first (important for feed)
//         .skip((page - 1) * size)
//         .limit(size)
//         .populate("authorId", "firstName lastName email profileUrl profileImage"),
//       PostModel.countDocuments(filter)
//     ]);

//     return { posts, total };
//   }

//   async delete(id: string): Promise<boolean> {
//     const result = await PostModel.findByIdAndDelete(id).exec();
//     return result !== null;
//   }
// }
import { QueryFilter, Types, Query } from "mongoose";
import { IPost, IPostComment, PostModel } from "../models/post.model";

export interface IPostRepository {
  create(post: IPost): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  update(id: string, data: Partial<IPost>): Promise<IPost | null>;
  addLike(id: string, userId: string): Promise<IPost | null>;
  addComment(id: string, comment: IPostComment): Promise<IPost | null>;
  removeComment(id: string, commentId: string): Promise<IPost | null>;
  findAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<{ posts: IPost[]; total: number }>;
  findAllByCommunity(
    communityId: string,
    page: number,
    size: number
  ): Promise<{ posts: IPost[]; total: number }>;
  findAllByAuthor(
    authorId: string,
    page: number,
    size: number
  ): Promise<{ posts: IPost[]; total: number }>;
  deleteByCommunityId(communityId: string): Promise<number>;
  delete(id: string): Promise<boolean>;
}

export class PostRepository implements IPostRepository {
  // Keeping populate logic in one place to avoid drift between methods
  private populatePost<T extends Query<any, any>>(query: T): T {
    return query
      .populate("authorId", "firstName lastName email profileUrl profileImage")
      .populate("communityId", "name slug")
      .populate(
        "comments.userId",
        "firstName lastName username profileUrl profileImage"
      ) as T;
  }

  async create(post: IPost): Promise<IPost> {
    const newPost = new PostModel(post);
    return await newPost.save();
  }

  async findById(id: string): Promise<IPost | null> {
    return await this.populatePost(PostModel.findById(id));
  }

  async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
    return await this.populatePost(PostModel.findByIdAndUpdate(id, data, { new: true }));
  }

  async addLike(id: string, userId: string): Promise<IPost | null> {
    return await this.populatePost(
      PostModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: new Types.ObjectId(userId) } },
        { new: true }
      )
    );
  }

  async addComment(id: string, comment: IPostComment): Promise<IPost | null> {
    return await this.populatePost(
      PostModel.findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              userId: new Types.ObjectId(comment.userId.toString()),
              text: comment.text,
              createdAt: new Date(),
            },
          },
          $inc: { commentsCount: 1 },
        },
        { new: true }
      )
    );
  }

  async removeComment(id: string, commentId: string): Promise<IPost | null> {
    return await this.populatePost(
      PostModel.findOneAndUpdate(
        { _id: id, "comments._id": new Types.ObjectId(commentId) },
        {
          $pull: { comments: { _id: new Types.ObjectId(commentId) } },
          $inc: { commentsCount: -1 },
        },
        { new: true }
      )
    );
  }

  async findAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<{ posts: IPost[]; total: number }> {
    const filter: QueryFilter<IPost> = {};

    const [posts, total] = await Promise.all([
      this.populatePost(
        PostModel.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * size)
          .limit(size)
      ),
      PostModel.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async findAllByCommunity(
    communityId: string,
    page: number,
    size: number
  ): Promise<{ posts: IPost[]; total: number }> {
    const filter: QueryFilter<IPost> = {
      communityId: communityId as any
    };

    const [posts, total] = await Promise.all([
      this.populatePost(
        PostModel.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * size)
          .limit(size)
      ),
      PostModel.countDocuments(filter)
    ]);

    return { posts, total };
  }

  async findAllByAuthor(
    authorId: string,
    page: number,
    size: number
  ): Promise<{ posts: IPost[]; total: number }> {
    const filter: QueryFilter<IPost> = {
      authorId: authorId as any
    };

    const [posts, total] = await Promise.all([
      this.populatePost(
        PostModel.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * size)
          .limit(size)
      ),
      PostModel.countDocuments(filter)
    ]);

    return { posts, total };
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async deleteByCommunityId(communityId: string): Promise<number> {
    const result = await PostModel.deleteMany({ communityId: communityId as any });
    return result.deletedCount || 0;
  }
}

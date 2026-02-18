import { QueryFilter } from "mongoose";
import { IPost, PostModel } from "../models/post.model";

export interface IPostRepository {
  create(post: IPost): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  update(id: string, data: Partial<IPost>): Promise<IPost | null>;
  findAll({
    page,
    size
  }: {
    page: number;
    size: number;
  }): Promise<{ posts: IPost[]; total: number }>;
  delete(id: string): Promise<boolean>;
}

export class PostRepository implements IPostRepository {

  async create(post: IPost): Promise<IPost> {
    const newPost = new PostModel(post);
    return await newPost.save();
  }

  async findById(id: string): Promise<IPost | null> {
    return await PostModel.findById(id)
      .populate("authorId", "firstName lastName email profileImage");
  }

  async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(id, data, { new: true })
      .populate("authorId", "firstName lastName email profileImage");
  }

  async findAll({ page, size }: { page: number; size: number })
    : Promise<{ posts: IPost[]; total: number }> {

    const filter: QueryFilter<IPost> = {};

    const [posts, total] = await Promise.all([
      PostModel.find(filter)
        .sort({ createdAt: -1 }) // newest first (important for feed)
        .skip((page - 1) * size)
        .limit(size)
        .populate("authorId", "firstName lastName email profileImage"),
      PostModel.countDocuments(filter)
    ]);

    return { posts, total };
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

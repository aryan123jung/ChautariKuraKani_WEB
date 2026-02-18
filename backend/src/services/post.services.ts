import { HttpError } from "../errors/http-error";
import { PostRepository } from "../repositories/post.repository";
import fs from "fs";
import path from "path";

const postRepo = new PostRepository();

export class PostService {

  async createPost(data: any) {
    return await postRepo.create(data);
  }

  async getAllPosts(
    { page, size }: { page?: string; size?: string }
  ) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { posts, total } = await postRepo.findAll({
      page: currentPage,
      size: pageSize
    });

    const pagination = {
      page: currentPage,
      size: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };

    return { posts, pagination };
  }

  async getPostById(id: string) {
    const post = await postRepo.findById(id);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }
    return post;
  }

  async updatePost(id: string, userId: string, data: any) {
    const post = await postRepo.findById(id);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    const postAuthorId =
      typeof post.authorId === "string"
        ? post.authorId
        : (post.authorId as any)?._id?.toString?.() || post.authorId.toString();

    if (postAuthorId !== userId) {
      throw new HttpError(403, "You can only edit your own post");
    }

    if (data.mediaUrl && post.mediaUrl && post.mediaUrl !== data.mediaUrl) {
      const oldMediaPath = path.resolve(process.cwd(), "uploads/posts", post.mediaUrl);
      if (fs.existsSync(oldMediaPath)) {
        fs.unlinkSync(oldMediaPath);
      }
    }

    const updatedPost = await postRepo.update(id, data);
    if (!updatedPost) {
      throw new HttpError(404, "Post not found");
    }

    return updatedPost;
  }

  async deletePost(id: string) {
    const post = await postRepo.findById(id);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }
    return await postRepo.delete(id);
  }
}

import { HttpError } from "../errors/http-error";
import { PostRepository } from "../repositories/post.repository";
import fs from "fs";
import path from "path";
import { NotificationService } from "./notification.services";
import { UserRepository } from "../repositories/user.repository";

const postRepo = new PostRepository();
const notificationService = new NotificationService();
const userRepo = new UserRepository();

export class PostService {
  private getAuthorId(post: any): string {
    return typeof post.authorId === "string"
      ? post.authorId
      : (post.authorId as any)?._id?.toString?.() || post.authorId.toString();
  }

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

    const postAuthorId = this.getAuthorId(post);

    if (postAuthorId !== userId) {
      throw new HttpError(403, "You can only edit your own post");
    }

    if (data.mediaUrl && post.mediaUrl && post.mediaUrl !== data.mediaUrl) {
      const candidatePaths = [
        path.resolve(process.cwd(), "uploads/posts", post.mediaUrl), // legacy location
        path.resolve(process.cwd(), "uploads/posts/images", post.mediaUrl),
        path.resolve(process.cwd(), "uploads/posts/videos", post.mediaUrl)
      ];

      for (const oldMediaPath of candidatePaths) {
        if (fs.existsSync(oldMediaPath)) {
          fs.unlinkSync(oldMediaPath);
          break;
        }
      }
    }

    const updatedPost = await postRepo.update(id, data);
    if (!updatedPost) {
      throw new HttpError(404, "Post not found");
    }

    return updatedPost;
  }

  async likePost(postId: string, userId: string) {
    const existingPost = await postRepo.findById(postId);
    if (!existingPost) {
      throw new HttpError(404, "Post not found");
    }

    const postOwnerId = this.getAuthorId(existingPost);
    const alreadyLiked = (existingPost.likes || []).some(
      (likedUserId: any) => likedUserId.toString() === userId
    );

    const post = await postRepo.addLike(postId, userId);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    if (!alreadyLiked && postOwnerId !== userId) {
      const actor = await userRepo.getUserById(userId);
      await notificationService.createNotification(
        postOwnerId,
        userId,
        "POST_LIKED",
        post._id.toString(),
        "New Like",
        `${actor?.firstName || "Someone"} liked your post`
      );
    }

    return post;
  }

  async addComment(postId: string, userId: string, text?: string) {
    if (!text || !text.trim()) {
      throw new HttpError(400, "Comment text is required");
    }

    const existingPost = await postRepo.findById(postId);
    if (!existingPost) {
      throw new HttpError(404, "Post not found");
    }

    const postOwnerId = this.getAuthorId(existingPost);

    const post = await postRepo.addComment(postId, {
      userId,
      text: text.trim(),
      createdAt: new Date()
    });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    if (postOwnerId !== userId) {
      const actor = await userRepo.getUserById(userId);
      const cleanComment = text.trim();
      const preview =
        cleanComment.length > 60 ? `${cleanComment.slice(0, 57)}...` : cleanComment;

      await notificationService.createNotification(
        postOwnerId,
        userId,
        "POST_COMMENTED",
        post._id.toString(),
        "New Comment",
        `${actor?.firstName || "Someone"} commented: "${preview}"`
      );
    }

    return post;
  }

  async getComments(postId: string) {
    const post = await postRepo.findById(postId);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }
    return post.comments || [];
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const post = await postRepo.findById(postId);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    const comment = (post.comments || []).find(
      (item: any) => item._id?.toString() === commentId
    );

    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }

    const commentOwnerId =
      typeof comment.userId === "string"
        ? comment.userId
        : comment.userId.toString();
    const postOwnerId = this.getAuthorId(post);

    if (commentOwnerId !== userId && postOwnerId !== userId) {
      throw new HttpError(403, "You can only delete your own comment");
    }

    const updatedPost = await postRepo.removeComment(postId, commentId);
    if (!updatedPost) {
      throw new HttpError(404, "Comment not found");
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

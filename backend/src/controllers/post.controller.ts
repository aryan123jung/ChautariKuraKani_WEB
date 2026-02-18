import { Request, Response } from "express";
import { PostService } from "../services/post.services";

const postService = new PostService();

interface QueryParams {
  page?: string;
  size?: string;
}

export class PostController {

  async createPost(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      req.body.authorId = userId;
      const uploadedMedia = req.file;

      if (uploadedMedia) {
        req.body.mediaUrl = uploadedMedia.filename;
        req.body.mediaType = uploadedMedia.mimetype.startsWith("video/")
          ? "video"
          : "image";
      }

      const post = await postService.createPost(req.body);

      return res.status(201).json({
        success: true,
        data: post,
        message: "Post created successfully"
      });

    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const { page, size }: QueryParams = req.query;

      const { posts, pagination } =
        await postService.getAllPosts({ page, size });

      return res.status(200).json({
        success: true,
        data: posts,
        pagination,
        message: "Posts fetched successfully"
      });

    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async getOnePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const post = await postService.getPostById(postId);

      return res.status(200).json({
        success: true,
        data: post,
        message: "Post fetched successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async updateOnePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const uploadedMedia = req.file;
      if (uploadedMedia) {
        req.body.mediaUrl = uploadedMedia.filename;
        req.body.mediaType = uploadedMedia.mimetype.startsWith("video/")
          ? "video"
          : "image";
      }

      const updatedPost = await postService.updatePost(postId, userId, req.body);

      return res.status(200).json({
        success: true,
        data: updatedPost,
        message: "Post updated successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async deleteOnePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;

      const deleted = await postService.deletePost(postId);

      return res.status(200).json({
        success: true,
        data: deleted,
        message: "Post deleted successfully"
      });

    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }
}

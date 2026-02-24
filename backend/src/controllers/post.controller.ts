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
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const deleted = await postService.deletePost(postId, userId);

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

  async likePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const post = await postService.likePost(postId, userId);
      return res.status(200).json({
        success: true,
        data: post,
        message: "Post liked successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async createComment(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { text } = req.body;
      const post = await postService.addComment(postId, userId, text);
      return res.status(201).json({
        success: true,
        data: post,
        message: "Comment added successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async getPostComments(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const comments = await postService.getComments(postId);
      return res.status(200).json({
        success: true,
        data: comments,
        message: "Comments fetched successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }

  async deletePostComment(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const commentId = req.params.commentId;
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const updatedPost = await postService.deleteComment(postId, commentId, userId);
      return res.status(200).json({
        success: true,
        data: updatedPost,
        message: "Comment deleted successfully"
      });
    } catch (err: any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }
}

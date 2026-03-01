import { Request, Response } from "express";
import { AdminPostService } from "../../services/admin/post.services";
import { QueryParams } from "../../types/query.type";

const adminPostService = new AdminPostService();

export class AdminPostController {
  async getAllPosts(req: Request, res: Response) {
    try {
      const { page, size }: QueryParams = req.query;
      const { posts, pagination } = await adminPostService.getAllPosts(page, size);
      return res.status(200).json({
        success: true,
        data: posts,
        pagination,
        message: "All posts fetched"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const deleted = await adminPostService.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }
}

import { Request, Response } from "express";
import { QueryParams } from "../types/query.type";
import { CommunityService } from "../services/community.services";
import { PostService } from "../services/post.services";

const communityService = new CommunityService();
const postService = new PostService();

export class CommunityController {
  async createCommunity(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const payload: any = { ...req.body };
      if (req.file) {
        payload.profileUrl = req.file.filename;
      }

      const community = await communityService.createCommunity(userId, payload);
      return res.status(201).json({
        success: true,
        data: community,
        message: "Chautari created successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async joinCommunity(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const community = await communityService.joinCommunity(userId, req.params.communityId);
      return res.status(200).json({
        success: true,
        data: community,
        message: "Joined Chautari successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async leaveCommunity(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const community = await communityService.leaveCommunity(userId, req.params.communityId);
      return res.status(200).json({
        success: true,
        data: community,
        message: "Left Chautari successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async deleteCommunity(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      await communityService.deleteCommunity(userId, req.params.communityId);
      return res.status(200).json({
        success: true,
        message: "Chautari deleted successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async searchCommunities(req: Request, res: Response) {
    try {
      const { page, size, search }: QueryParams = req.query;
      const { communities, pagination } = await communityService.searchCommunities(
        search,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: communities,
        pagination,
        message: "Chautari search results"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getCommunityById(req: Request, res: Response) {
    try {
      const community = await communityService.getCommunityById(req.params.communityId);
      return res.status(200).json({
        success: true,
        data: community,
        message: "Chautari fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getMemberCount(req: Request, res: Response) {
    try {
      const { count } = await communityService.getMemberCount(req.params.communityId);
      return res.status(200).json({
        success: true,
        data: { count },
        message: "Chautari member count fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async createPostInCommunity(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const communityId = req.params.communityId;
      await communityService.ensureJoined(userId, communityId);

      req.body.authorId = userId;
      req.body.communityId = communityId;
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
        message: "Post created in Chautari successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getCommunityPosts(req: Request, res: Response) {
    try {
      const { page, size }: QueryParams = req.query;
      const { posts, pagination } = await postService.getPostsByCommunity(
        req.params.communityId,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: posts,
        pagination,
        message: "Chautari posts fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}

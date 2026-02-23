import { Request, Response } from "express";
import { QueryParams } from "../types/query.type";
import { CallService } from "../services/call.services";

const callService = new CallService();

export class CallController {
  async listMyCalls(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { calls, pagination } = await callService.listMyCalls(userId, page, size);

      return res.status(200).json({
        success: true,
        data: calls,
        pagination,
        message: "Call history fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}

import z from "zod";

export const PostSchema = z.object({
  caption: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  communityId: z.string().optional(),
  authorId: z.string()
}).refine(
  (data) => data.caption || data.mediaUrl,
  {
    message: "Post must contain either caption or media"
  }
);

export type PostType = z.infer<typeof PostSchema>;

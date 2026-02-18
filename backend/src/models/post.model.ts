import mongoose, { Document, Schema } from "mongoose";
import { PostType } from "../types/post.type";

export interface IPost extends Omit<PostType, "authorId">, Document {
  authorId: mongoose.Types.ObjectId | string;
  _id: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPost>(
  {
    caption: { type: String },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const PostModel = mongoose.model<IPost>("Post", schema);
// PostModel -> db.posts

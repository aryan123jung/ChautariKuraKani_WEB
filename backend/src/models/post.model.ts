import mongoose, { Document, Schema } from "mongoose";
import { PostType } from "../types/post.type";

export interface IPostComment {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  text: string;
  createdAt: Date;
}

export interface IPost extends Omit<PostType, "authorId">, Document {
  authorId: mongoose.Types.ObjectId | string;
  _id: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: IPostComment[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPost>(
  {
    caption: { type: String },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: false
    },

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
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String,
          required: true,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
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

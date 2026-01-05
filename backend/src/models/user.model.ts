import mongoose,{Document,Schema} from "mongoose";
import { UserType } from "../types/user.type";
import { required } from "zod/v4/core/util.cjs";
import { email } from "zod";

const userMongoSchema: Schema = new Schema(
    {
        firstName: {type:String, required: true},
        lastName: {type:String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type:String, required:true},
        confirmPassword: {type:String, required:true},
        role: {type: String, enum: ['user','admin'],default:'user'}
    },
    {
        timestamps: true,
    }
)
export interface IUser extends UserType, Document{
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export const UserModel = mongoose.model<IUser>("User", userMongoSchema);
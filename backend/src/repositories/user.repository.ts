import { IUser, UserModel } from "../models/user.model";

export interface IUserRepository{
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;

    createUser(userData: Partial<IUser>): Promise<IUser>;
    getUserById(userId: string):Promise <IUser | null>;
    getAllusers(): Promise<IUser[]>;
    updateUser(userId: string, updatedDate: Partial<IUser>): Promise<IUser| null>;
    deleteUser(userId: string): Promise<boolean | null>;
}

export class UserRepository implements IUserRepository{
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData);
        await user.save();
        return user;
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"email" : email});
        return user;
    }
    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"username": username});
        return user;
    }
    async getUserById(userId: string): Promise<IUser | null> {
        const user = await UserModel.findById(userId);
        return user;
    }
    async getAllusers(): Promise<IUser[]> {
        const users = await UserModel.find();
        return users;
    }
    async updateUser(userId: string, updatedData: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updatedData,
            {new: true}
        );
        return updatedUser;
    }
    async deleteUser(userId: string): Promise<boolean | null> {
        const result = await UserModel.findByIdAndDelete(userId);
        return result? true: false;
    }
 
}
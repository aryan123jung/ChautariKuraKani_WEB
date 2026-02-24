export type CommunityUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type CommunityItem = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  profileUrl?: string;
  members?: Array<string | CommunityUser>;
  creatorId?: string | CommunityUser;
  createdAt?: string;
};

export type CommunityPost = {
  _id: string;
  caption?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  authorId?: string | CommunityUser;
  communityId?: string | CommunityItem;
  likes?: string[];
  comments?: CommunityPostComment[];
  commentsCount?: number;
  createdAt?: string;
};

export type CommunityPostComment = {
  _id?: string;
  userId?:
    | string
    | {
        _id?: string;
        firstName?: string;
        lastName?: string;
        profileUrl?: string;
        profileImage?: string;
      };
  text: string;
  createdAt?: string;
};

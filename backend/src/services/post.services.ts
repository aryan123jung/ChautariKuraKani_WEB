import { HttpError } from "../errors/http-error";
import { PostRepository } from "../repositories/post.repository";

const postRepo = new PostRepository();

export class PostService {

  async createPost(data: any) {
    return await postRepo.create(data);
  }

  async getAllPosts(
    { page, size }: { page?: string; size?: string }
  ) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { posts, total } = await postRepo.findAll({
      page: currentPage,
      size: pageSize
    });

    const pagination = {
      page: currentPage,
      size: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };

    return { posts, pagination };
  }

  async deletePost(id: string) {
    const post = await postRepo.findById(id);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }
    return await postRepo.delete(id);
  }
}

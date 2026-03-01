import { PostRepository } from "../../repositories/post.repository";

const postRepository = new PostRepository();

export class AdminPostService {
  async getAllPosts(page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { posts, total } = await postRepository.findAll({
      page: pageNumber,
      size: pageSize
    });

    return {
      posts,
      pagination: {
        page: pageNumber,
        size: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async deletePost(postId: string) {
    return await postRepository.delete(postId);
  }
}

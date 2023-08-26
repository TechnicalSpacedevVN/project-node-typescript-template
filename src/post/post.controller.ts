import {
  Controller,
  Delete,
  Patch,
  Post,
  UseGuard,
  Validate,
} from "@/common/core/decorator";
import { Post as PostModel } from "./models/post.model";
import {
  validateCreatePostSchema,
  validateUpdatePostSchema,
} from "./post.validate-schema";
import { AuthRequest } from "@/common/@type";
import { CreatePostInput, UpdatePostInput } from "./post.type";
import { HttpResponse } from "@/common/utils/HttpResponse";
import { HidePost } from "./models/hide-post.model";

@Controller("/post")
@UseGuard()
export class PostController {
  @Post()
  @Validate(validateCreatePostSchema)
  async createPost(req: AuthRequest<CreatePostInput>) {
    const { content, image } = req.body;
    const post = new PostModel({
      content,
      image,
      author: req.user,
    });

    await post.save();
    return HttpResponse.created(post);
  }

  @Patch("/:id")
  @Validate(validateUpdatePostSchema)
  async updatePost(req: AuthRequest<UpdatePostInput, any, { id: string }>) {
    let post = await PostModel.findOne({
      _id: req.params.id,
      author: req.user,
    });
    if (post) {
      const { content, image } = req.body;

      return HttpResponse.updated(
        await PostModel.updateOne(
          { _id: req.params.id },
          {
            content,
            image,
            author: req.user,
          }
        )
      );
    }
  }

  @Delete("/:id")
  async deletePost(req: AuthRequest<any, any, { id: string }>) {
    let post = await PostModel.findOne({
      _id: req.params.id,
      author: req.user,
    });
    if (post) {
      return HttpResponse.deleted(
        await PostModel.deleteOne({ _id: req.params.id })
      );
    }

    throw "Bạn không có quyền trên này biết này";
  }

  @Post("/hide-post/:id")
  async hidePost(req: AuthRequest<any, any, { id: string }>) {
    let hidePost = new HidePost({
      createdBy: req.user,
      postId: req.params.id,
    });
    hidePost.save();

    return HttpResponse.success(hidePost);
  }
}

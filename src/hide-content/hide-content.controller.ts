import { Controller, Post, UseGuard, Validate } from "@/common/core/decorator";
import { HttpResponse } from "@/common/utils/HttpResponse";
import { validateCreateHideContentSchema } from "./hide-content.validate-schem";
import { AuthRequest } from "@/common/@type";
import { HideContent } from "./hide-content.model";

@Controller("/hide-content")
@UseGuard()
export class HideContentController {
  @Post("/:id")
  @Validate(validateCreateHideContentSchema)
  async hidePost(req: AuthRequest<{ type: string }, any, { id: string }>) {
    let hidePost = new HideContent({
      createdBy: req.user,
      refId: req.params.id,
      type: req.body.type,
    });
    hidePost.save();

    return HttpResponse.success(hidePost);
  }
}

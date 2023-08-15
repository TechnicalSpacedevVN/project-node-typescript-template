import { Controller, Middlewares, Post } from "@/common/core/decorator";
import { upload } from "./file.middleware";
import { HttpResponse } from "@/common/utils/HttpResponse";
import { Request } from "express";
import { UseGuard } from "@/common/core/decorator/guard";

@Controller("/file")
@UseGuard()
export class FileController {
  @Post("/upload")
  @Middlewares(upload.single("file"))
  upload(req: Request) {
    if (req.file) {
      return HttpResponse.success({
        filename: `/upload/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    }
  }

  @Post("/uploads")
  @Middlewares(upload.array("files"))
  uploads(req: Request) {
    if (Array.isArray(req.files)) {
      let resData = req.files.map((e: any) => ({
        filename: `/upload/${e.filename}`,
        size: e.size,
        mimetype: e.mimetype,
      }));
      return HttpResponse.success(resData);
    }
  }
}

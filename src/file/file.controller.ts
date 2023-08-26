import { Controller, Middlewares, Post } from "@/common/core/decorator";
import { upload } from "./file.middleware";
import { Request } from "express";
import { HttpResponse } from "@/common/utils/HttpResponse";

const STORAGE_URL = process.env.STORAGE_URL;

@Controller("/file")
export class FileController {
  @Post("/single")
  @Middlewares(upload.single("file"))
  async uploadSingle(req: Request) {
    if (req.file) {
      return HttpResponse.success({
        url: `${STORAGE_URL}/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    }
    return false;
  }

  @Post("/multi")
  @Middlewares(upload.array("files"))
  async uploadMulti(req: Request) {
    if (Array.isArray(req.files)) {
      let resData = req.files.map((e) => ({
        url: `${STORAGE_URL}/${e.filename}`,
        size: e.size,
        mimetype: e.mimetype,
      }));
      return HttpResponse.success(resData);
    }
    return false;
  }
}

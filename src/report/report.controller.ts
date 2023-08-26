import {
  Controller,
  Middlewares,
  Post,
  UseGuard,
  Validate,
} from "@/common/core/decorator";
import { validateCreateReportSchema } from "./report.valdiate-schema";
import { AuthRequest } from "@/common/@type";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { ReportService } from "./report.service";
import { HttpResponse } from "@/common/utils/HttpResponse";
import { BodyCreateReport, CreateReportInput } from "./report.type";

@Controller("/report")
@UseGuard()
export class ReportController {
  @Inject(ReportService) reportService!: ReportService;

  @Post("/:id")
  @Validate(validateCreateReportSchema)
  async createReport(req: AuthRequest<BodyCreateReport, any, { id: string }>) {
    return HttpResponse.created(
      await this.reportService.createReport({
        ...req.body,
        createdBy: req.user,
        refId: req.params.id,
      })
    );
  }
}

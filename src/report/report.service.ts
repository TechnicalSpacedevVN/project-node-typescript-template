import { Injectable } from "@/common/core/decorator/DI-IoC";
import { CreateReportInput } from "./report.type";
import { Report } from "./report.model";

@Injectable()
export class ReportService {
  async createReport(input: CreateReportInput) {
    let report = new Report(input);
    await report.save();
    return report;
  }
}

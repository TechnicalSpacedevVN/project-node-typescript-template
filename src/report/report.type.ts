export enum ReportType {
  Post = "Post",
  User = "user",
}

export interface CreateReportInput {
  createdBy: string;
  refId: string;
  type: ReportType;
  content?: string;
}

export interface BodyCreateReport
  extends Omit<CreateReportInput, "refId" | "createdBy"> {}

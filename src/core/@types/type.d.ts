declare module "mongoose" {
  interface Model<
    TRawDocType,
    TQueryHelpers = {},
    TInstanceMethods = {},
    TVirtuals = {},
    THydratedDocumentType = HydratedDocument<
      TRawDocType,
      TVirtuals & TInstanceMethods,
      TQueryHelpers
    >,
    TSchema = any
  > {
    paginate: (...args: any[]) => any;
    demo: () => number;
  }
}

declare interface A {
  a: string;
}

import { Auth, Field, GraphQL, Resolve } from "@/common/core/decorator";
import { Comment } from "./comment.model";
import { User } from "@/user/user.model";
import { AuthContext } from "@/common/@types/type";
import { HideContent } from "@/hide-content/hide-content.model";
import { Report } from "@/report/report.model";
import { Post } from "@/post/models/post.model";

@GraphQL(
  `Comment`,
  `
    refId: String!
    _id: String!
    createdBy: User
    content: String
    createdAt: Date
    image: String
    countReply: Int
    replys: [Comment]
`
)
export class CommentSchema {
  @Field("replys")
  @Auth
  async replys(parent: any, _: any, context: AuthContext) {
    let hideCommentIds = (
      await HideContent.find({
        createdBy: context.user,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);
    return await Comment.find({
      replyId: parent._id,
      _id: { $nin: hideCommentIds },
    });
  }

  @Field("countReply")
  @Auth
  async countReply(parent: any, _: any, context: AuthContext) {
    let hideCommentIds = (
      await HideContent.find({
        createdBy: context.user,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);

    let commentReportIds = (
      await Report.find({
        createdBy: context.user,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);
    return await Comment.count({
      replyId: parent._id,
      _id: { $nin: [...hideCommentIds, ...commentReportIds] },
    });
  }

  @Field("createdBy")
  async createdBy(parent: any) {
    return await User.findOne({ _id: parent.createdBy });
  }

  @Resolve("comments(refId: String!): [Comment]")
  @Auth
  async comments(_: any, { refId }: { refId: string }, context: AuthContext) {
    let hideCommentIds = (
      await HideContent.find({
        createdBy: context.user,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);

    let commentReportIds = (
      await Report.find({
        createdBy: context.user,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);

    let authorId = (await Post.findOne({ _id: refId }).select("author"))
      ?.author;

    let authorHiddenComment = (
      await HideContent.find({
        createdBy: authorId,
        type: "Comment",
      }).select("refId")
    ).map((e) => e.refId);

    return await Comment.find({
      refId,
      replyId: { $exists: false },
      _id: {
        $nin: [...hideCommentIds, ...commentReportIds, authorHiddenComment],
      },
    });
  }

  @Resolve("comment(id: String!): Comment")
  @Auth
  async comment(_: any, { id }: { id: string }) {
    return await Comment.findOne({ _id: id });
  }
}

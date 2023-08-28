import { Field, GraphQL, Resolve } from "@/common/core/decorator";
import { Comment } from "./comment.model";
import { User } from "@/user/user.model";

@GraphQL(
  `Comment`,
  `
    refId: String!
    _id: String!
    createdBy: User
    content: String
    createdAt: Date
    image: String
`
)
export class CommentSchema {
  @Field("createdBy")
  async createdBy(parent: any) {
    return await User.findOne({ _id: parent.createdBy });
  }

  @Resolve("comments(refId: String!): [Comment]")
  async comments(_: any, { refId }: { refId: string }) {
    return await Comment.find({ refId });
  }
}

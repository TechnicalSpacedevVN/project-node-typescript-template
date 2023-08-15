import { GraphQLServer } from "./common/core/decorator";
import { UserSchema } from "./user/user.graphql";
import { PostSchema } from "./post/post.graphql";
import { FriendSchema } from "./friend/friend.graphql";
import { CommentSchema } from "./comment/comment.graphql";
@GraphQLServer({ defs: [UserSchema, PostSchema, FriendSchema, CommentSchema] })
export class GraphqlModule {}

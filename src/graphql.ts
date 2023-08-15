import { GraphQLServer } from "./common/core/decorator";
import { UserSchema } from "./user/user.graphql";
import { PostSchema } from "./post/post.graphql";
import { FriendSchema } from "./friend/friend.graphql";
@GraphQLServer({ defs: [UserSchema, PostSchema, FriendSchema] })
export class GraphqlModule {}

import { ApolloServer } from "@apollo/server";
import { dateScalar } from "./common/utils/dateScalar";
// import { userSchema } from "./user/user.model";
import { FriendService } from "./friend/friend.service";
import { container } from "@core/decorator/DI-IoC";
import { GraphQLServer } from "./common/core/decorator";
import { UserSchema } from "./user/user.graphql";
import { FriendSchema } from "./friend/friend.graphql";
import { PostSchema } from "./post/post.graphql";
// const typeDefs = `#graphql
//     scalar Date
//     ${userSchema}
//     type Query {
//       friends(search: String): [User]
//     }
// `;

// const resolvers = {
//   Date: dateScalar,
//   Query: {
//     friends: async (_: any, { search }: { search: string }) => {
//       let friendService = container.resolve(FriendService);
//       return await friendService.searchFriend(search);
//     },
//   },
// };

// export const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// @GraphQL(User)
// export class UserSchema{

// }

@GraphQLServer({
  defs: [UserSchema, FriendSchema, PostSchema],
  scalars: [dateScalar],
  url: '/graph',
  // playground: '/graphql-playground'
})
export class GraphQLApp {}

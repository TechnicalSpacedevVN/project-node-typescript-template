import { ApolloServer } from "@apollo/server";
import { dateScalar } from "./common/utils/dateScalar";
// import { userSchema } from "./user/user.model";
import { FriendService } from "./friend/friend.service";
import { container } from "@core/decorator/DI-IoC";
import { GraphQLServer } from "./common/core/decorator";
import { UserSchema } from "./user/user.graphql";
import { FriendSchema } from "./friend/friend.graphql";
import { PostSchema } from "./post/post.graphql";
import jsonwebtoken from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { JWT } from "./common/config";
import { JWTPayload } from "./auth/auth.service";
import { CommentSchema } from "./comment/comment.graphql";
// const typeDefs = `#graphql
//     scalar Date
//     type Post {
//       author: User
//     }

//     type Query {

//       friends(search: String): [User]
//     }
// `;

// const resolvers = {
//   Date: dateScalar,
//   Query: {
//     Post: {
//       author: () => {}
//     },
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

// location: {
//   type: { type: String, default: "Point" },
//   coordinates: [Number],
// },
const LocationType = `
  type Location {
    coordinates: [Float]
    type: String
  }
`;

@GraphQLServer({
  defs: [UserSchema, FriendSchema, PostSchema, LocationType, CommentSchema],
  scalars: [dateScalar],
  url: "/graphql",
  playground: "/graphql-devtool",
  guard: (context: any, next: any) => {
    try {
      let { bearToken } = context;
      if (!bearToken) {
        throw new GraphQLError("Api này bắt buộc có auth");
      }

      let check = jsonwebtoken.verify(bearToken, JWT.SECRET_KEY) as JWTPayload;
      if (check) {
        context.user = check.id;
        return next();
      }
    } catch (err: any) {
      throw new GraphQLError(err.message, {
        extensions: {
          code: err.code,
        },
      });
    }
  },
})
export class GraphQLApp {}

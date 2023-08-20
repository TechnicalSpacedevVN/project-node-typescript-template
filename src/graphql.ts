import { dateScalar } from "./common/utils/dateScalar";
// import { userSchema } from "./user/user.model";
import jsonwebtoken from "jsonwebtoken";
import { GraphQLServer } from "./common/core/decorator";
import { FriendSchema } from "./friend/friend.graphql";
import { PostSchema } from "./post/post.graphql";
import { UserSchema } from "./user/user.graphql";
import { JWT } from "./common/config";
import { JWTPayload } from "./auth/auth.service";
import { GraphQLError } from "graphql";
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
  scalars: [
    {
      name: "Date",
      type: dateScalar,
    },
  ],
  url: "/graphql",
  playground: "/graphql-playground",
  getContext: async ({ req, res }) => {
    return { bearerToken: req.headers.authorization?.split("Bearer ")[1] };
  },
  guard: (context, next) => {
    let { bearerToken } = context;
    if (!bearerToken) {
      throw new GraphQLError("Api yêu cầu quyền truy cập", {
        extensions: {
          code: "Forbiden",
        },
      });
    }

    try {
      let check = jsonwebtoken.verify(
        bearerToken,
        JWT.SECRET_KEY
      ) as JWTPayload;

      if (check) {
        context.user = check.id;
        return next();
      }

      throw "Có lỗi xẩy ra";
    } catch (err) {
      throw new GraphQLError("Token không chính xác, vui lòng kiểm tra lại", {
        extensions: {
          code: "Forbiden",
        },
      });
    }
  },
})
export class GraphQLApp {}

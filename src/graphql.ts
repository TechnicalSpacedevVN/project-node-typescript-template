import { ApolloServer } from "@apollo/server";
import { dateScalar } from "./utils/dateScalar";
import { UserType } from "./models/user.model";
import { FriendService } from "./services/friend.service";
import { container } from "./core/decorator/DI-IoC";
const typeDefs = `#graphql
    scalar Date
    ${UserType}
    type Query {
      friends(search: String): [User]
    }
`;

const resolvers = {
  Date: dateScalar,
  Query: {
    friends: async (_: any, { search }: { search: string }) => {
      let friendService = container.resolve(FriendService);
      return await friendService.searchFriend(search);
    },
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});

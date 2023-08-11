import { ApolloServer } from "@apollo/server";
import { dateScalar } from "./utils/dateScalar";
import { userSchema } from "./models/user.model";
import { FriendService } from "./services/friend.services";
const typeDefs = `#graphql
    scalar Date
    ${userSchema}
    type Query {
      friends(search: String): [User]
    }
`;

const resolvers = {
  Date: dateScalar,
  Query: {
    friends: async (_: any, { search }: { search: string }) => {
      return await FriendService.searchFriend(search);
    },
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});

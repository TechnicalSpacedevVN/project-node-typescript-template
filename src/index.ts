import { config } from "dotenv";
import { databaseConfig } from "@/common/config/database";
import { errorMiddleware } from "@/common/config/error.middleware";
import { AppDecorator, BaseApp } from "@core/decorator/AppDecorator";
import { UserController } from "./user/user.controller";
import { FriendController } from "./friend/friend.controller";
import { expressMiddleware } from "@apollo/server/express4";
// import { server } from "./graphql";
import { AuthController } from "./auth/auth.controller";
import { JwtMiddleware } from "@/common/config/jwt.middlware";
import { GraphQLApp } from "./graphql";
import { PostController } from "./post/post.controller";

config();
let port = process.env.PORT;

@AppDecorator({
  controllers: [
    UserController,
    FriendController,
    AuthController,
    PostController,
  ],
  database: databaseConfig,
  guard: JwtMiddleware,
  modules: [GraphQLApp],
})
class App extends BaseApp {}

let app = new App();

const main = async () => {
  app.use(errorMiddleware);
  // await server.start();
  // app.use("/graphql", expressMiddleware(server));
  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`);
  });
};

main();

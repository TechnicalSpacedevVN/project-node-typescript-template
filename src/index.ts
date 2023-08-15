import { AppDecorator, BaseApp } from "@core/decorator/AppDecorator";
import { config } from "dotenv";
import { AuthController } from "./auth/auth.controller";
import { databaseConfig } from "./common/config/database";
import { errorMiddleware } from "./common/config/error.middleware";
import { JWTMiddlware } from "./common/config/jwt.middleware";
import { FriendController } from "./common/utils/friend.controller";
import { GraphqlModule } from "./graphql";
import { PostController } from "./post/post.controller";
import { UserController } from "./user/user.controller";

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
  guard: JWTMiddlware,
  modules: [GraphqlModule],
})
class App extends BaseApp {}

let app = new App();

const main = async () => {
  app.use(errorMiddleware);
  // app.use("/graphql", expressMiddleware(server));
  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`);
  });
};

main();

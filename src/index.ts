import { config } from "dotenv";
import { databaseConfig } from "./config/database";
import { errorMiddleware } from "./config/error.middleware";
import { AppDecorator, BaseApp } from "./core/decorator/AppDecorator";
import { UserController } from "./controllers/UserController";
import { FriendController } from "./controllers/FriendController";
import { expressMiddleware } from "@apollo/server/express4";
import { server } from "./graphql";
import { AuthController } from "./controllers/AuthController";
import { JWTMiddlware } from "./config/jwt.middleware";

config();
let port = process.env.PORT;

@AppDecorator({
  controllers: [UserController, FriendController, AuthController],
  database: databaseConfig,
  guard: JWTMiddlware,
})
class App extends BaseApp {}

let app = new App();

const main = async () => {
  app.use(errorMiddleware);
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`);
  });
};

main();

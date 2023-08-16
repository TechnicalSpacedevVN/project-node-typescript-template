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
import { CommentController } from "./comment/comment.controller";
import { FileController } from "./file/file.controller";
import rateLimit from "express-rate-limit";
import express from "express";

config();
let port = process.env.PORT;

@AppDecorator({
  controllers: [
    UserController,
    FriendController,
    AuthController,
    PostController,
    CommentController,
    FileController,
  ],
  database: databaseConfig,
  guard: JWTMiddlware,
  modules: [GraphqlModule],
})
class App extends BaseApp {}

let app = new App();

const main = async () => {
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
  });

  app.use(apiLimiter);
  app.use("/media", express.static("./upload"));
  app.use(errorMiddleware);
  // app.use("/graphql", expressMiddleware(server));
  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`);
  });
};

main();

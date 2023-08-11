import { config } from "dotenv";
import { databaseConfig } from "./config/database";
import { errorMiddleware } from "./config/error.middleware";
import { AppDecorator, BaseApp } from "./core/decorator/AppDecorator";
import { UserController } from "./controllers/UserController";

config();
let port = process.env.PORT;

@AppDecorator({
  controllers: [UserController],
  database: databaseConfig,
})
class App extends BaseApp {}

let app = new App();

const main = async () => {
  app.use(errorMiddleware);
  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`);
  });
};

main();

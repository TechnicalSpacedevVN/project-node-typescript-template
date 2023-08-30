import cors from "cors";
import { config } from "dotenv";
import express, { Express } from "express";
import { createServer } from "http";
import helmet from "helmet";
import path from "path";
import { errorMiddleware } from "../../config/error.middleware";
import {
  IDatabaseConfig,
  connectData as connectDatabase,
} from "../mongoose-config";
import { BaseMiddleware } from "..";
import { container } from "./DI-IoC";
import { APP_KEY } from "./key";

interface AppDecoratorOptions {
  controllers?: any[];
  database?: IDatabaseConfig;
  guard?: new () => BaseMiddleware;
  modules?: any[];
}

export interface AppData {
  app: Express;
  httpServer: ReturnType<typeof createServer>;
}

export const AppDecorator = (options?: AppDecoratorOptions) => {
  let { controllers, modules } = options || {};

  return (target: any) => {
    return class extends target {
      app: Express;
      httpServer: ReturnType<typeof createServer>;
      constructor() {
        super();
        this.app = express();
        this.httpServer = createServer(this.app);
        if (options?.database) {
          connectDatabase(options.database);
        }

        // const accessLogStream = fs.createWriteStream(
        //   path.join(__dirname, "./logs/access.log"),
        //   { flags: "a" }
        // );
        // const {config} = require('dotenv')

        // morgan.token("id", (req) => {
        //   return req.id;
        // });

        config();
        // function assignId(req, res, next) {
        //   req.id = randomUUID();
        //   next();
        // }

        this.app.set("view engine", "html");
        this.app.set("views", path.resolve("./src/views"));

        this.app.use(express.json());
        this.app.use(
          cors({
            // origin: ["*"],
          })
        );

        this.app.use(
          helmet({
            crossOriginResourcePolicy: false,
            contentSecurityPolicy: {
              directives: {
                "script-src": ["self"],
              },
              reportOnly: true,
            },
          })
        );

        // this.app.use(assignId);

        // this.app.use(logMiddleware)
        // this.app.use(morgan("combined", { stream: accessLogStream }));

        // this.app.use(xTokenMiddleware)

        if (Array.isArray(controllers) && controllers.length > 0) {
          for (let i in controllers) {
            new controllers[i](this.app, {
              guard: options?.guard,
            });
          }
        }

        // this.app.use("/task", taskRouter);
        // this.app.use("/category", categoryRouter);
        // this.app.use("/user", userRouter);
        // this.app.use("/file", fileRouter);
        // this.app.use("/auth", authRouter);

        // this.app.use(pageRouter);

        this.app.use(errorMiddleware);

        container.register(APP_KEY, {
          app: this.app,
          httpServer: this.httpServer,
        });
        // this.app.all("*", (req, res) => {
        //   res.status(404).json({ error: "Not Found" });
        // });
      }

      async listen(port: number | string | undefined, cb: () => void) {
        if (Array.isArray(modules)) {
          for (let i in modules) {
            let m = modules[i];
            let module = new m();
            await module.start();
          }
        }

        this.httpServer.listen(port, cb);
      }

      use(...args: any[]): void {
        this.app.use(...args);
      }
    };
  };
};

export class BaseApp {
  listen(port: number | string | undefined, cb: Function) {}
  use(...args: any[]): void {}
}

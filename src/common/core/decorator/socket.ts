import { Server, ServerOptions, Socket } from "socket.io";
import { AppData } from ".";
import { container } from "./DI-IoC";
import {
  APP_KEY,
  SOCKET_EVENTS,
  SOCKET_IO,
  SOCKET_KEY,
  SOCKET_USERS,
} from "./key";
import { instrument } from "@socket.io/admin-ui";
import _ from "lodash";

export interface SocketAppData {
  io: Server;
}

export interface SocketUsersData {
  [k: string]: Socket;
}

export interface SocketServerOptions extends Partial<ServerOptions> {
  providers: any[];
  admin?: Parameters<typeof instrument>[1];
}

type MetaEvent = {
  [k: string]: ((client: Socket, ...args: any[]) => void)[];
};

export const SocketServer = (options?: SocketServerOptions) => {
  return (target: any) => {
    return class extends target {
      constructor() {
        super();
        container.register(SOCKET_USERS, {});
      }
      start() {
        const { httpServer }: AppData = container.resolve(APP_KEY);
        let _options = _.omit(options, "providers", "admin");
        let io = new Server(httpServer, _options);
        container.register(SOCKET_IO, io);
        container.register(SOCKET_KEY, { io });
        console.log("Socket start");

        io.use((socket: any, next) => {
          socket.demo = "asdfasdf";
          console.log("middleware");
          next();
        });

        // let events = {
        //   'join room': [handler, handler, handler],
        //   'connection': [handler, handler]
        // }

        let events: MetaEvent = {};

        if (Array.isArray(options?.providers)) {
          for (let i in options?.providers) {
            let provider = new (options.providers as any)[i]();
            let metadata: MetaEvent = Reflect.getMetadata(
              SOCKET_EVENTS,
              provider
            );

            for (let i in metadata) {
              if (typeof events[i] === "undefined") events[i] = [];

              events[i].push(...metadata[i].map((e) => e.bind(provider)));
            }
          }
        }

        io.on("connection", (socket) => {
          let users: SocketUsersData = container.resolve(SOCKET_USERS);
          users[socket.id] = socket;
          container.register(SOCKET_USERS, users);
          events?.connection?.forEach((e) => e(socket));
          //

          for (let i in events) {
            if (["connection", "disconnect"].includes(i)) {
              continue;
            }

            socket.on(i, (...args: any) => {
              events[i].forEach((e) => e(socket, ...args));
            });
          }

          //
          socket.on("disconnect", (reasone) => {
            let users: SocketUsersData = container.resolve(SOCKET_USERS);
            delete users[socket.id];
            container.register(SOCKET_USERS, users);
            events?.disconnect?.forEach((e) => e(socket));
          });
        });

        if (options?.admin) {
          instrument(io, options.admin);
        }
      }
    };
  };
};

export const SubscribeMessage = (event: string): any => {
  return (target: any, method: string, descriptor: PropertyDescriptor): any => {
    let sockets = Reflect.getMetadata(SOCKET_EVENTS, target) || {};
    if (typeof sockets[event] === "undefined") sockets[event] = [];
    sockets[event].push(descriptor.value);
    Reflect.defineMetadata(SOCKET_EVENTS, sockets, target);
  };
};

export const WebsocketServer = (): any => {
  return (target: any, attributeName: string | symbol, index: number) => {
    Object.defineProperty(target, attributeName, {
      get: () => container.resolve(SOCKET_IO),
      enumerable: false,
      configurable: false,
    });
  };
};

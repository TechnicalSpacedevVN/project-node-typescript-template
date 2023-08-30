import { Server, ServerOptions, Socket } from "socket.io";
import { AppData } from ".";
import { container } from "./DI-IoC";
import { APP_KEY, SOCKET_EVENTS, SOCKET_IO } from "./key";
import _ from "lodash";
import { instrument } from "@socket.io/admin-ui";

export interface SocketServerOptions extends Partial<ServerOptions> {
  providers: any[];
  admin?: Parameters<typeof instrument>[1];
}
export type MetaEvent = {
  [k: string]: ((socket: Socket, ...args: any[]) => void)[];
};
export const SocketServer = (options: SocketServerOptions) => {
  return (target: any) => {
    return class extends target {
      constructor() {
        super();
      }

      start() {
        console.log("Socket start");
        let { httpServer }: AppData = container.resolve(APP_KEY);

        let _options = _.omit(options, "providers");

        let io = new Server(httpServer, _options);
        container.register(SOCKET_IO, io);

        let events: MetaEvent = {};

        for (let i in options.providers) {
          let provider = new options.providers[i]();
          let metadata: MetaEvent = Reflect.getMetadata(
            SOCKET_EVENTS,
            provider
          );
          for (let j in metadata) {
            if (typeof events[j] === "undefined") events[j] = [];

            events[j].push(...metadata[j].map((e) => e.bind(provider)));
          }
        }

        io.on("connection", (socket) => {
          console.log("User connected");
          events?.connection?.forEach((handler) => handler(socket));
          //code here
          for (let i in events) {
            if (["connection", "disconnect"].includes(i)) {
              continue;
            }

            socket.on(i, (...args: any[]) => {
              events[i].forEach((handler) => handler(socket, ...args));
            });
          }
          //

          socket.on("disconnect", () => {
            events?.disconnect?.forEach((handler) => handler(socket));
            console.log("User disconnect");
          });
        });

        if (options.admin) {
          instrument(io, {
            auth: false,
            mode: "development",
          });
        }
      }
    };
  };
};

export const SubscribeMessage = (event: string) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    let sockets = Reflect.getMetadata(SOCKET_EVENTS, target) || {};

    /**
     * {
     *  join-room: [handler, handler, handler]
     * }
     */

    if (typeof sockets[event] === "undefined") sockets[event] = [];

    sockets[event].push(descriptor.value);

    // Cập nhật lại metadata
    Reflect.defineMetadata(SOCKET_EVENTS, sockets, target);
  };
};

export const IoServer = () => {
  return (target: any, attributeName: string) => {
    Object.defineProperty(target, attributeName, {
      configurable: false, // Không cho phép viết lại,
      enumerable: false,
      get: () => container.resolve(SOCKET_IO),
    });
  };
};

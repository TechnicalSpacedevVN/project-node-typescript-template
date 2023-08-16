import _ from "lodash";
import mongoose, { Schema } from "mongoose";
import {
  APP_TOKEN,
  GRAPHQL_KEY,
  GRAPHQL_PARAM_KEY,
  GRAPHQL_RESOLVE_KEY,
} from "./key";
import { ApolloServer } from "@apollo/server";
import { BaseContext } from "@apollo/server";
import { AppData } from ".";
import { container } from "./DI-IoC";
import { expressMiddleware } from "@apollo/server/express4";

enum ParamType {
  Param = "param",
  Parent = "parent",
}

let map = new Map();
map.set(String, "String");
map.set(Schema.Types.String, "String");
map.set(Number, "Int");
map.set(Schema.Types.Number, "Int");
// map.set(Boolean, "Boolean");
// map.set(Schema.Types.Boolean, "Boolean");

// map.set(Date, "Date");
// map.set(Schema.Types.Date, "Date");
map.set("ObjectId", "String");

export interface GraphQLServerOptions {
  defs: any[];
  scalars?: any[];
}

export const GraphQLServer = (options: GraphQLServerOptions): any => {
  return (target: any) => {
    return class extends target {
      server: ApolloServer<BaseContext>;
      constructor() {
        super();

        let _types = "";
        let _queries = "";
        let _resolvers: any = {};

        for (let schema of options.defs) {
          let s = new schema();
          _types += s.getType();
          _queries += s.getQuery();
          _resolvers = { ..._resolvers, ...s.getResolver() };
        }

        const typeDefs = `#graphql
                ${_types}
                type Query {
                  ${_queries}
                }
            `;

        const resolvers = {
          Query: _resolvers,
        };
        this.server = new ApolloServer({
          typeDefs,
          resolvers,
        });
      }

      async start() {
        await this.server.start();
        let { app }: AppData = container.resolve(APP_TOKEN);
        app.use("/graphql", expressMiddleware(this.server));
        console.log("Graphql Start Successfully");
      }
    };
  };
};

export const GraphQL = (model: mongoose.Model<any>, options?: any): any => {
  return (target: any) => {
    return class extends target {
      constructor() {
        super();
      }
      getType() {
        let fields = _.omitBy(
          _.reduce(
            (model.schema as any).tree,
            (result: any, current: any, key: string) => {
              return { ...result, [key]: map.get(current.type) };
            },
            {}
          ),
          _.isUndefined
        );

        return `
            type ${model.modelName} {
              ${_.map(
                fields,
                (value, key) => `
                  ${key}: ${value}`
              )}
            }
        `;
      }

      getQuery() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        return _.map(queries, (value, key) => {
          let params = Reflect.getMetadata(GRAPHQL_PARAM_KEY, this, key);
          let _p = "";
          if (Array.isArray(params)) {
            _p = `(${params
              .filter((e) => e.type === ParamType.Param)
              .map((e) => `${e.name}:String`)
              .join(",")})`;
          }

          return `
                  ${key}${_p}: ${value}
              `;
        }).join("");
      }

      getResolver() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        let results: any = {};
        _.forEach(queries, (value, key) => {
          let params: any[] = Reflect.getMetadata(GRAPHQL_PARAM_KEY, this, key);

          results[key] = (parent: any, args: any) => {
            let _p: any[] = [];

            for (let pa of params) {
              _p.push(args[pa.name]);
            }

            return this[key].apply(this, _p);
          };
        });
        return results;
      }
    };
  };
};

export const Resolve =
  (type: string) =>
  (target: any, propertyKey: string, descriptor: any): any => {
    let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, target) || {};
    queries[propertyKey] = type;
    Reflect.defineMetadata(GRAPHQL_RESOLVE_KEY, queries, target);
  };

export const Parent = (target: any, propertyKey: string, index: number) => {
  let params: any[] =
    Reflect.getMetadata(GRAPHQL_PARAM_KEY, target, propertyKey) || [];

  params.unshift({
    type: ParamType.Param,
  });
  Reflect.defineMetadata(GRAPHQL_PARAM_KEY, params, target, propertyKey);
};

export const Param =
  (name: string) => (target: any, propertyKey: string, index: number) => {
    let params: any[] =
      Reflect.getMetadata(GRAPHQL_PARAM_KEY, target, propertyKey) || [];

    params.unshift({
      type: ParamType.Param,
      name,
    });
    Reflect.defineMetadata(GRAPHQL_PARAM_KEY, params, target, propertyKey);
  };

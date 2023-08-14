import _ from "lodash";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      index: "text",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserType = `
    type User {
        id: String
        name: String
    }
`;

// export class UserSchema {

// }

export const User = mongoose.model("User", userSchema);

let map = new Map();
map.set(String, "String");
map.set(Schema.Types.String, "String");
map.set(Number, "Int");
map.set(Schema.Types.Number, "Int");
map.set(Boolean, "Boolean");
map.set(Schema.Types.Boolean, "Boolean");

map.set(Date, "Date");
map.set(Schema.Types.Date, "Date");
map.set("ObjectId", "String");

const GraphQL = (schema: any): any => {
  return (target: any) => {
    Reflect.defineMetadata(
      "graphqltype",
      _.omitBy(
        _.reduce(
          (schema.schema as any).tree,
          (result: any, current: any, key: string) => {
            return { ...result, [key]: map.get(current.type) };
          },
          {}
        ),
        _.isUndefined
      ),
      target
    );
  };
};

const Resolve = (target: any, propertyKey: string, descriptor: any): any => {};

@GraphQL(User)
export class UserClass {
  @Resolve
  users() {}
}

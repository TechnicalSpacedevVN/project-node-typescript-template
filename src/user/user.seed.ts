import { databaseConfig } from "@/common/config/database";
import { connectDatabase } from "@/common/core/mongoose-config";
import { faker } from "@faker-js/faker";
import { User } from "./user.model";
import { hashPassword } from "./utils";
import _ from "lodash";

(async () => {
  await connectDatabase(databaseConfig);

  let count: any = process.argv.splice(2)[0];

  count = parseInt(count) || 10;

  await User.insertMany(
    _.uniqBy(faker.helpers.multiple(
      () => {
        return {
          avatar: faker.internet.avatar(),
          birthday: faker.date.anytime(),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: hashPassword(faker.internet.password()),
          verify: true,
        };
      },
      { count: parseInt(count) || 10 }
    ), 'email')
  );
  console.log(`Seed success ${count} user`);
  process.exit();
})();

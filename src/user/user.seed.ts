import { databaseConfig } from "@/common/config/database";
import { connectData } from "@/common/core/mongoose-config";
import { faker } from "@faker-js/faker";
import { hashPassword } from "./utils";
import { User } from "./user.model";
import _ from "lodash";

(async () => {
  console.log("start");
  await connectData(databaseConfig);

  // let count = parseInt(process.argv.splice(2)[0] || "10");
  // let users = faker.helpers.multiple(
  //   () => {
  //     return {
  //       name: faker.person.fullName(),
  //       email: faker.internet.email(),
  //       avatar: faker.internet.avatar(),
  //       birthday: faker.date.past(),
  //       password: hashPassword("1234123aS"),
  //       verify: true,
  //       code: "",
  //       changePasswordHistories: [],
  //     };
  //   },
  //   { count }
  // );

  // await User.insertMany(_.uniqBy(users, "email"));

  let users = await User.find();
  await Promise.all(
    users.map(async (e) => {
      // e.nickname = faker.internet.displayName();
      // e.hideFriendList = false;
      // e.cover = faker.image.url({ height: 700, width: 1900 });
      e.allowFollow = true;
      await e.save();
      return;
    })
  );

  // await User.updateMany({}, [
  //   {
  //     $set: {
  //       email: {
  //         $toLower: "$email",
  //       },
  //     },
  //   },
  // ]);
  console.log("Successfully");
  // console.log(`Tạo ${count} user thành công`);
  process.exit();
})();

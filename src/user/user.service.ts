import { User } from "./user.model";
import crypto from "crypto";
import { randomCode } from "@/common/utils/randomCode";

import fs from "fs";
import path from "path";
import { sendMail } from "@/common/utils/sendMail";
import { Injectable } from "@core/decorator/DI-IoC";
import {
  ChangePasswordByCodeInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  RegisterInput,
  UpdateUserInfoInput,
  VerifyRegisterInput,
} from "./type";
import { hashPassword } from "./utils";
import moment from "moment";

const emailRegisterHtml = fs
  .readFileSync(path.resolve("./src/user/views/email-register.html"))
  .toString();

const forfotPasswordHtml = fs
  .readFileSync(path.resolve("./src/user/views/email-reset-password.html"))
  .toString();

// 18/01/2023 - 18/08/2023
// 18/07/2023

// 18/04/2023
// 18/10/2023

// 18/08/2023 - 18/07/2023 = 1
// 18/08/2023 - 18/10/2023 = -2

@Injectable()
export class UserService {
  public async register(userData: RegisterInput) {
    let check = await User.findOne({ email: userData.email });
    if (check) {
      throw "Email này đã tồn tại";
    }

    let { password, email } = userData;
    password = hashPassword(password);
    let code = randomCode(100);

    let user = await User.create({ ...userData, password, code });
    // user.password = undefined;

    await sendMail({
      from: '"Spacedev.vn 👻" <study@spacedev.vn>', // sender address
      to: email, // list of receivers
      subject: "Kích hoạt tài khoản spacedev.vn", // Subject line
      html: emailRegisterHtml, // html body
      data: {
        link: `http://localhost:8000/user/verify-register?code=${code}&email=${email}`,
      },
    });

    return user;
  }

  public async verifyRegister(input: VerifyRegisterInput) {
    let { code, email } = input;
    let user = await User.findOne({
      email,
      code,
      verify: false,
    });
    if (user) {
      user.verify = true;
      user.code = "";
      await user.save();
      return true;
    }

    throw "Thao tác lỗi";
  }

  public async updateInfo(id: string, input: UpdateUserInfoInput) {
    return await User.updateOne({ _id: id }, input);
  }

  public async changePassword(
    userId: string,
    { newPassword, oldPassword }: ChangePasswordInput
  ) {
    newPassword = hashPassword(newPassword);
    oldPassword = hashPassword(oldPassword);

    let user = await User.findOne({ _id: userId, password: oldPassword });

    if (user) {
      if (Array.isArray(user.changePasswordHistories)) {
        let histories = user.changePasswordHistories.filter(
          (e) => moment().unix() - moment(e.changeAt).add(6, "month").unix() < 0
        );
        if (histories.find((e) => e.password === newPassword)) {
          throw "Vui lòng thay đổi password khác những password cũ trong khoảng 6 tháng gần nhât";
        }
      }
      user.password = newPassword;

      await user.updateOne({
        $set: {
          password: newPassword,
        },
        $push: {
          changePasswordHistories: [
            {
              password: newPassword,
              changeAt: new Date(),
            },
          ],
        },
      });

      return "Cập nhật tài khoản thành công";
    }

    throw "Sai password, vui lòng kiểm tra lại";
  }

  public async forgotPassword({ email, redirect }: ForgotPasswordInput) {
    let user = await User.findOne({ email });
    if (!user) {
      throw "User này không tồn tại";
    }
    if (user.sendMailAt && Date.now() - user.sendMailAt?.getTime() < 60_000) {
      throw `Vui thực hiện hành động này trong ${
        59 - Math.round((Date.now() - user.sendMailAt?.getTime()) / 1000)
      } giây`;
    }

    let code = randomCode(100);
    // user.code = code;
    // user.sendMailAt = new Date()

    await user.updateOne({
      $set: {
        code,
        sendMailAt: new Date(),
      },
    });
    await sendMail({
      from: '"Spacedev.vn 👻" <study@spacedev.vn>', // sender address
      to: email, // list of receivers
      subject: "Tìm lại tài khoản spacedev.vn", // Subject line
      html: forfotPasswordHtml, // html body
      data: {
        link: `${redirect}?code=${code}&email=${email}`,
      },
    });
    return "Vui lòng kiểm tra email để tìm lại mật khẩu";
  }

  public async changePasswordByCode({
    code,
    email,
    newPassword,
  }: ChangePasswordByCodeInput) {
    let user = await User.findOne({
      email,
      code,
    });
    if (user) {
      user.code = "";
      let password = hashPassword(newPassword);
      user.password = password;

      await user.save();
      return "Thay đổi mật khẩu thành công";
    }

    throw "Thao tác lỗi";
  }

  public async searchUser(exclude: string, name = '') {
    return await User.find({
      $text: {
        $search: name,
      },
      _id: {
        $ne: exclude,
      },
    });
  }
}

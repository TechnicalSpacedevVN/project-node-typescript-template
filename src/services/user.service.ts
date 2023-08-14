import { User } from "../models/user.model";
import crypto from "crypto";
import { randomCode } from "../utils/randomCode";

import fs from "fs";
import path from "path";
import { sendMail } from "../utils/sendMail";

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface VerifyRegisterInput {
  email: string;
  code: string;
}

const emailRegisterHtml = fs
  .readFileSync(path.resolve("./src/views/email-register.html"))
  .toString();

const forfotPasswordHtml = fs
  .readFileSync(path.resolve("./src/views/email-reset-password.html"))
  .toString();

export class UserService {
  public static async register(userData: RegisterInput) {
    let check = await User.findOne({ email: userData.email });
    if (check) {
      throw "Email này đã tồn tại";
    }

    let { password, email } = userData;
    password = crypto.createHash("sha256").update(password).digest("hex");
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

  public static async verifyRegister(input: VerifyRegisterInput) {
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
}

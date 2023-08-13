import crypto from "crypto";
import { User } from "../models/user.model";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "../config";
import { Token } from "../models/token.model";

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtData {
  id: string;
}

export class AuthService {
  public static async login(input: LoginInput) {
    let { email, password } = input;

    password = crypto.createHash("sha256").update(password).digest("hex");

    let user = await User.findOne({
      email,
      password,
      verify: true,
    });
    if (user) {
      let accessToken = jsonwebtoken.sign({ id: user.id }, JWT.SECRET_KEY, {
        expiresIn: JWT.EXPIRED_IN,
      });

      let refreshToken = jsonwebtoken.sign({ id: user.id }, JWT.SECRET_KEY);

      await Token.deleteMany({
        userId: user._id,
      });

      let token = new Token({ refreshToken, userId: user.id });
      await token.save();

      return { accessToken, refreshToken };
    }

    throw "Email hoặc password không chính xác";
  }

  public static async refreshToken(token: string) {
    let check = jsonwebtoken.verify(token, JWT.SECRET_KEY) as JwtData;
    let checkDB = await Token.findOne({
      refreshToken: token,
      enabled: true,
    });
    if (checkDB) {
      let accessToken = jsonwebtoken.sign({ _id: check.id }, JWT.SECRET_KEY, {
        expiresIn: JWT.EXPIRED_IN,
      });

      return {
        accessToken,
        refreshToken: token,
      };
    }

    throw "Refresh Token Invalid";
  }
}

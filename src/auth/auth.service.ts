import crypto from "crypto";
import { User } from "@/user/user.model";
import { JWT } from "@/common/config";
import jsonwebtoken from "jsonwebtoken";
import { Token } from "./token.model";
import { Injectable } from "@core/decorator/DI-IoC";



export interface LoginInput {
  email: string;
  password: string;
}
export interface JWTPayload {
  id: string;
}



@Injectable()
export class AuthService {
  public async login(input: LoginInput) {
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
        userId: user.id,
      });

      let token = new Token({ refreshToken, userId: user.id });
      await token.save();

      return { accessToken, refreshToken };
    }

    throw "Email hoặc password không chính xác";
  }

  public async refreshToken(refreshToken: string) {
    let check = jsonwebtoken.verify(refreshToken, JWT.SECRET_KEY) as JWTPayload;
    let checkDB = await Token.findOne({
      refreshToken,
      enabled: true,
    });
    if (checkDB) {
      let accessToken = jsonwebtoken.sign({ id: check.id }, JWT.SECRET_KEY);

      return {
        accessToken,
        refreshToken,
      };
    }
    throw "Thao tác thất bại"
  }
}

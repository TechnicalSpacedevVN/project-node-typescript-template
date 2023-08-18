import crypto from "crypto";

export const validatePassowrd = (value: any, helper: any) => {
  // hoa - thường - đặc biệt - số
  let numberRegex = /\d/;
  let thuong = /[a-z]/;
  let hoa = /[A-Z]/;
  let dacBiet = /[!@#\$%\^\&*\)\(+=._-]+$/;

  let count = 0;

  if (numberRegex.test(value)) count++;
  if (thuong.test(value)) count++;
  if (hoa.test(value)) count++;
  if (dacBiet.test(value)) count++;
  let { name } = helper.state.ancestors[0];
  // console.log(helper.state)

  name = name?.toLowerCase();
  let _p = value.toLowerCase();

  if (name) {
    if (_p.includes(name)) {
      return helper.message("Không được chứa tên trong pasword");
    }
  }

  if (count < 3) return helper.message("Password của bản không đủ mạnh");
};

export const validateNewPassword = (value: any, helper: any) => {
  // hoa - thường - đặc biệt - số
  let numberRegex = /\d/;
  let thuong = /[a-z]/;
  let hoa = /[A-Z]/;
  let dacBiet = /[!@#\$%\^\&*\)\(+=._-]+$/;

  let count = 0;

  if (numberRegex.test(value)) count++;
  if (thuong.test(value)) count++;
  if (hoa.test(value)) count++;
  if (dacBiet.test(value)) count++;
  let { oldPassword } = helper.state.ancestors[0];
    // console.log(oldPassword , value)
  if (oldPassword === value) {
    return helper.message("Password mới và password cũ không được giống nhau");
  }

  if (count < 3) return helper.message("Password của bản không đủ mạnh");
};

export const hashPassword = (password: string) =>
  crypto.createHash("sha256").update(password).digest("hex");

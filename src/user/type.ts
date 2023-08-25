export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface VerifyRegisterInput {
  email: string;
  code: string;
}

export interface UpdateUserInfoInput {
  name?: string;
  avatar?: string;
  birthday: Date;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
  redirect: string;
}

export interface ChangePasswordByCodeInput {
  email: string;
  code: string;
  newPassword: string;
}

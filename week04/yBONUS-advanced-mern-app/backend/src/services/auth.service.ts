import { WEB_URL } from "../constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utilities/appAssert";
import { hashValue } from "../utilities/bcrypt";
import {
  fiveMinutesAgo,
  ONE_DAY_IN_MILISECONDS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utilities/date";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utilities/emailTemplates";
import {
  RefreshTokenPayload,
  RefreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utilities/jwt";
import { sendMail } from "../utilities/sendMail";

export type AuthParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async ({
  email,
  password,
  userAgent,
}: AuthParams) => {
  // chucaobuon:
  // lilsadfoqs: Verify user existance
  const existingUser = await UserModel.exists({
    email,
  });

  // if(existingUser) {
  //     throw new Error('This email has been used for another account!');
  // }

  appAssert(
    !existingUser,
    CONFLICT,
    "This email has been used for another account"
  );

  // chucaobuon:
  // lilsadfoqs: Create user
  const user = await UserModel.create({
    email,
    password,
  });

  const userId = user._id;

  // chucaobuon:
  // lilsadfoqs: Create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${WEB_URL}/email/verify/${verificationCode._id}`;
  // chucaobuon:
  // lilsadfoqs: Send verification email

  const { data, error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  // chucaobuon:
  // lilsadfoqs: Create session
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  // chucaobuon:
  // lilsadfoqs: Sign accessToken & refreshToken
  const refreshToken = signToken(sessionInfo, RefreshTokenSignOptions);

  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
  });

  // chucaobuon:
  // lilsadfoqs: return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password, userAgent }: AuthParams) => {
  // chucaobuon:
  // lilsadfoqs: Validate credentials then get the user by email
  const user = await UserModel.findOne({
    email,
  });

  appAssert(user, UNAUTHORIZED, "Wrong credentials (email || password)");

  const isCorrectPassword = await user.comparePassword(password);
  appAssert(
    isCorrectPassword,
    UNAUTHORIZED,
    "Wrong credentials (email || password)"
  );

  const userId = user._id;

  // chucaobuon:
  // lilsadfoqs: Create a session
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  // chucaobuon:
  // lilsadfoqs: Sign accessToken & refreshToken
  const refreshToken = signToken(sessionInfo, RefreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  // chucaobuon:
  // lilsadfoqs: Return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: RefreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session Expired"
  );

  // chucaobuon:
  // lilsadfoqs: Automatically refresh a session if it expires in the next 24 hours
  const sessionNeedsRefresh =
    session.expiresAt.getTime() - now <= ONE_DAY_IN_MILISECONDS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, RefreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  // chucaobuon:
  // lilsadfoqs: Validate the existance of the verification code in DB
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(validCode, NOT_FOUND, "Verification code is invalid or expired!");

  // chucaobuon:
  // lilsadfoqs: Find and update the user by id

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      verified: true,
    },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify your email!");

  // chucaobuon:
  // lilsadfoqs: Delete the verified code from the DB
  await validCode.deleteOne();

  // chucaobuon:
  // lilsadfoqs: Return user
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendResetPasswordEmail = async (email: string) => {
  // chucaobuon:
  // lilsadfoqs: Validate the user email
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "User not found!");

  const userId = user._id;

  // chucaobuon:
  // lilsadfoqs: Check email rate limit
  const count = await VerificationCodeModel.countDocuments({
    userId,
    type: VerificationCodeType.PasswordRest,
    createdAt: { $gt: fiveMinutesAgo() },
  });

  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many password reset requests recently! Try again later"
  );

  // chucaobuon:
  // lilsadfoqs: Create verication code for the type password reset
  const expiresAt = oneHourFromNow();

  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.PasswordRest,
    expiresAt,
  });

  // chucaobuon:
  // lilsadfoqs: Send reset password request email
  const url = `${WEB_URL}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  // chucaobuon:
  // lilsadfoqs: Return success
  return {
    url,
    emailId: data.id,
  };
};

export const resetPassword = async (code: string, password: string) => {
  // chucaobuon:
  // lilsadfoqs: Validate the code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.PasswordRest,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "The code is either invalid or expired!");

  // chucaobuon:
  // lilsadfoqs: Find user by the code's user Id then update the password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Reset password failed!");

  // chucaobuon:
  // lilsadfoqs: Delete the code from the DB
  await validCode.deleteOne();

  // chucaobuon:
  // lilsadfoqs: Delete all of that user's sessions
  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });

  // chucaobuon:
  // lilsadfoqs: Return user
  return {
    user: updatedUser.omitPassword(),
  };
};


import { PORT, WEB_URL } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from '../models/session.model';
import UserModel from "../models/user.model";
import VerificationCodeModel from '../models/verificationCode.model';
import appAssert from "../utilities/appAssert";
import { ONE_DAY_IN_MILISECONDS, oneYearFromNow, thirtyDaysFromNow } from "../utilities/date";
import { getVerifyEmailTemplate } from "../utilities/emailTemplates";
import { RefreshTokenPayload, RefreshTokenSignOptions, signToken, verifyToken } from "../utilities/jwt";
import sendMail from "../utilities/sendMail";

export type AuthParams = {
    email: string;
    password: string;
    userAgent?: string;
}

export const createAccount = async(data: AuthParams) => {
    // chucaobuon: 
    // lilsadfoqs: Verify user existance
    const existingUser = await UserModel.exists({
        email: data.email
    })

    // if(existingUser) {
    //     throw new Error('This email has been used for another account!');
    // }

    appAssert(!existingUser, CONFLICT, "This email has been used for another account");

    // chucaobuon: 
    // lilsadfoqs: Create user
    const user = await UserModel.create({
        email: data.email,
        password: data.password
    });

    const userId = user._id;

    // chucaobuon: 
    // lilsadfoqs: Create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    const url = `${WEB_URL}/email/verify/${verificationCode._id}`
    // chucaobuon: 
    // lilsadfoqs: Send verification email
    try {
        await sendMail({
            to: user.email,
            ...getVerifyEmailTemplate(url)
        });
    } catch (error) {
        console.log(error);
    }

    // chucaobuon: 
    // lilsadfoqs: Create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent
    })

    const sessionInfo = {
        sessionId: session._id,
    }

    // chucaobuon: 
    // lilsadfoqs: Sign accessToken & refreshToken
    const refreshToken = signToken(
        sessionInfo,
        RefreshTokenSignOptions
    );

    const accessToken = signToken({
        userId: user._id,
        sessionId: session._id
    });

    // chucaobuon: 
    // lilsadfoqs: return user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }
};

export const loginUser = async (data: AuthParams) => {
    // chucaobuon: 
    // lilsadfoqs: Validate credentials then get the user by email
    const user = await UserModel.findOne({ 
        email: data.email
     });

    appAssert(user, UNAUTHORIZED, "Wrong credentials (email || password)");

    const isCorrectPassword = await user.comparePassword(data.password);
    appAssert(isCorrectPassword, UNAUTHORIZED, "Wrong credentials (email || password)");

    const userId = user._id;

    // chucaobuon: 
    // lilsadfoqs: Create a session
     const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent,
     });

     const sessionInfo = {
        sessionId: session._id
     }

    // chucaobuon: 
    // lilsadfoqs: Sign accessToken & refreshToken
    const refreshToken = signToken(
        sessionInfo,
        RefreshTokenSignOptions
    );

    const accessToken = signToken({
        ...sessionInfo,
        userId
    });

    // chucaobuon: 
    // lilsadfoqs: Return user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }
};

export const refreshUserAccessToken = async (refreshToken: string) => {
    const {
        payload
    } = verifyToken<RefreshTokenPayload>(refreshToken, {
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
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_IN_MILISECONDS;

    if(sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh 
        ? signToken(
            { sessionId: session._id },
            RefreshTokenSignOptions
        ) : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id
    });

    return {
        accessToken,
        newRefreshToken,
    }
};
 
export const verifyEmail = async (code: string) => {
    // chucaobuon: 
    // lilsadfoqs: Validate the existance of the verification code in DB
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeType.EmailVerification,
        expiresAt: { $gt: new Date() }
    });

    appAssert(validCode, NOT_FOUND, "Verification code is invalid or expired!");

    // chucaobuon: 
    // lilsadfoqs: Find and update the user by id

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {
            verified: true
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
        user: updatedUser.omitPassword()
    }
}
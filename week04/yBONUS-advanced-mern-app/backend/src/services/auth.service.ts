import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { BAD_REQUEST, CONFLICT, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utilities/appAssert";
import { oneYearFromNow } from "../utilities/date";
import jwt from "jsonwebtoken";

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

    // chucaobuon: 
    // lilsadfoqs: Create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    // chucaobuon: 
    // lilsadfoqs: Send verification email

    // chucaobuon: 
    // lilsadfoqs: Create session
    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent
    })

    // chucaobuon: 
    // lilsadfoqs: Sign accessToken & refreshToken
    const refreshToken = jwt.sign(
        { sessionId: session._id },
        JWT_REFRESH_SECRET,
        {
            audience: ["user"],
            expiresIn: "30d"
        }
    );

    const accessToken = jwt.sign(
        {
            userId: user._id,
            sessionId: session._id
        },
        JWT_SECRET,
        {
            audience: ["user"],
            expiresIn: "15m"
        }
    );

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

    // chucaobuon: 
    // lilsadfoqs: Create a session

    // chucaobuon: 
    // lilsadfoqs: Sign accessToken & refreshToken

    // chucaobuon: 
    // lilsadfoqs: Return user & tokens
}
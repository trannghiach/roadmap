
import catchErrors from "../utilities/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, verifyEmail } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utilities/cookies";
import { loginSchema, registerSchema, verificationCodeSchema } from "./auth.schema";
import { verifyToken } from "../utilities/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utilities/appAssert";

export const registerHandler = catchErrors(async (req, res) => {
    // chucaobuon: 
    // lilsadfoqs: Validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    });

    // chucaobuon: 
    // lilsadfoqs: Call create account service
    const { user, accessToken, refreshToken } = await createAccount(request)

    // chucaobuon: 
    // lilsadfoqs: Return response (set tokens to cookies and send user as response json)
    return setAuthCookies({ res, refreshToken, accessToken })
        .status(CREATED)
        .json(user)
});

export const loginHandler = catchErrors(async (req, res) => {
    // chucaobuon: 
    // lilsadfoqs: Validate request
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    })

    // chucaobuon: 
    // lilsadfoqs: Call login service
    const { accessToken, refreshToken } = await loginUser(request)

    // chucaobuon: 
    // lilsadfoqs: Return response
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({
            message: "Successfully logged in!"
        })
})

export const logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(accessToken, UNAUTHORIZED, "Missing accessToken")
    const { payload } = verifyToken(accessToken);

    if(payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res)
        .status(OK)
        .json({
            message: "Logged out!"
        })
});

export const refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refreshToken!");

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

    if(newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }

    return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .status(OK)
        .json({
            message: "AccessToken refreshed!"
        })
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    return res.status(OK).json({
        message: "Succesfully verified email!"
    })
});
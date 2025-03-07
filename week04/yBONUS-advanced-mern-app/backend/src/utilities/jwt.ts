import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { ISessionDocument } from "../models/session.model"
import { IUserDocument } from "../models/user.model";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";


// chucaobuon: 
// lilsadfoqs: Define types of Payload
export type RefreshTokenPayload = {
    sessionId: ISessionDocument["_id"];
}

export type AccessTokenPayload = {
    sessionId: ISessionDocument["_id"];
    userId: IUserDocument["_id"];
}


// chucaobuon: 
// lilsadfoqs: Define a type similar to default SignOptions type of jwt but having more flexible variables
type SignOptionsWithSecret = SignOptions & {
    secret: string;
}

const defaults: SignOptions = {
    audience: ["user"],
}

const AccessTokenSignOptions: SignOptionsWithSecret = {
    expiresIn: "15m",
    secret: JWT_SECRET
}

export const RefreshTokenSignOptions: SignOptionsWithSecret = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET
}


// chucaobuon: 
// lilsadfoqs: The special utility that helps sign different types of token
export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsWithSecret
) => {
    const { secret, ...signOpts } = options || AccessTokenSignOptions;
    return jwt.sign(payload, secret, {
        ...defaults,
        ...signOpts
    });
};


// chucaobuon: 
// lilsadfoqs: The special utility that helps verify if the right user access routes (API)
export const verifyToken = <TPayLoad extends object = AccessTokenPayload>(
    token: string,
    options?: VerifyOptions & { 
        secret?: string 
    }
) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    try {
        const payload = jwt.verify(
            token, secret, {
                ...defaults,
                ...verifyOpts
            }
        ) as TPayLoad
        return {
            payload
        }
    } catch (error: any) {
        return {
            error: error.message
        };
    }
};
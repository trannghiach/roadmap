
import catchErrors from "../utilities/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED } from "../constants/http";
import { setAuthCookies } from "../utilities/cookies";
import { loginSchema, registerSchema } from "./auth.schema";


export const registerHandler = catchErrors(async(req, res) => {
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

export const loginHandler = catchErrors(async(req, res) => {
    // chucaobuon: 
    // lilsadfoqs: Validate request
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    })

    // chucaobuon: 
    // lilsadfoqs: Call login service
    const {} = await loginUser(request)

    // chucaobuon: 
    // lilsadfoqs: Return response

})
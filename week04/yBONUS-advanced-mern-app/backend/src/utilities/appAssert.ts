
// chucaobuon: 
// lilsadfoqs: Asserts a condition and throws an AppErro if the condition is falsy

import assert from "node:assert"
import AppErrorCode from "../constants/AppErrorCode"
import { HttpStatusCode } from "../constants/http"
import AppError from "./AppError";

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
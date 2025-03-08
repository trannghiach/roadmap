import AppErrorCode from "../constants/AppErrorCode";
import { HttpStatusCode } from "../constants/http";


class AppError extends Error{
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode
    ) {
        // chucaobuon: 
        // lilsadfoqs: Call the constuctor of the base Error class and assign the message to the AppError
        super(message);
    }
};

export default AppError;
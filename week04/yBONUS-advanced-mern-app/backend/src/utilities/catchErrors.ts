
// chucaobuon: 
// lilsadfoqs: Special utility to help catch async errors
import { NextFunction, Request, Response } from "express"

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const catchErrors = (controller: AsyncController): AsyncController => 
    async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            // chucaobuon: 
            // lilsadfoqs: If there're errors, pass them on
            next(error);
        }
    }

export default catchErrors;
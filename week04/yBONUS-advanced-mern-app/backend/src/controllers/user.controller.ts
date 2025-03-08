import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utilities/appAssert";
import catchErrors from "../utilities/catchErrors";



export const getUserHandler = catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    appAssert(user, NOT_FOUND, "Error getting user infor (user not found)!");

    return res
        .status(OK)
        .json(
            user.omitPassword()
        )
});
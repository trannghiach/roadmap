import mongoose, { Types } from "mongoose";
import VerificationCodeType from "../constants/verificationCodeTypes";

// chucaobuon: 
// lilsadfoqs: Create the interface for the Verification Code Schema
export interface IVerificationCodeDocument extends mongoose.Document<Types.ObjectId> {
    userId: mongoose.Types.ObjectId;
    type: VerificationCodeType;
    expiresAt: Date;
    createdAt: Date;
};

// chucaobuon: 
// lilsadfoqs: Create the schema for verificationCodeModel
const verificationCodeSchema = new mongoose.Schema<IVerificationCodeDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    }
);


// chucaobuon: 
// lilsadfoqs: Create a collection named 'verification_codes' instead of the default 'verificationCodes'
const VerificationCodeModel = mongoose.model<IVerificationCodeDocument>(
    'VerificationCode',
    verificationCodeSchema,
    'verification_codes'
);

export default VerificationCodeModel;
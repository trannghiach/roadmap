import mongoose, { Types } from "mongoose";
import { thirtyDaysFromNow } from "../utilities/date";

// chucaobuon: 
// lilsadfoqs: Create the interface for the Session Schema
export interface ISessionDocument extends mongoose.Document<Types.ObjectId> {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
};

const sessionSchema = new mongoose.Schema<ISessionDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userAgent: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        default: thirtyDaysFromNow
    }
});

const SessionModel = mongoose.model<ISessionDocument>(
    'Session',
    sessionSchema
);

export default SessionModel;
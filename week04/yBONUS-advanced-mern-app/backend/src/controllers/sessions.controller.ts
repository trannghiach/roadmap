import { z } from "zod";
import { CONFLICT, NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import appAssert from "../utilities/appAssert";
import catchErrors from "../utilities/catchErrors";


export const getSessionsHandler = catchErrors(async (req, res) => {
    const sessions = await SessionModel.find(
        {
        userId: req.userId,
        expiresAt: { $gt: new Date() }
        },
        {
            _id: 1,
            userAgent: 1,
            expiresAt: 1,
            createdAt: 1
        },
        {
            sort: { createdAt: -1 }
        }
    )
    appAssert(
        sessions,
        NOT_FOUND,
        "No sessions found!"
    );

    return res
        .status(OK)
        .json(
            sessions.map(session => ({
                ...session.toObject(),
                ...(
                    session.id === req.sessionId && {
                        isCurrent: true
                    }
                )
            }))
        );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id)
    const currentSessionId = z.string().parse(req.sessionId);

    appAssert(
        sessionId !== currentSessionId,
        CONFLICT,
        "Conflict found! Cannot delete the current session."
    );

    const deletedSession = await SessionModel.findOneAndDelete({
        _id: sessionId,
        userId: req.userId
    });

    appAssert(
        deletedSession,
        NOT_FOUND,
        "Session not found => Cannot delete!"
    );

    return res
        .status(OK)
        .json({
            message: "Session deleted"
        });
});
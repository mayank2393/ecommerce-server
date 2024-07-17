import { prisma } from "..";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (user : any) => {
    return jwt.sign(
        {
            id:user.id,
            role:user.role,
            email:user.email
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

export const generateRefreshToken = (user : any) => {
    return jwt.sign(
        {
            id:user.id,
            role:user.role,
            email:user.email
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
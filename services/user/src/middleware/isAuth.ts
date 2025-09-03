import type { NextFunction,Request,Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { IUser } from "../model/User.js";

export interface AuthenticatedRequest extends Request{
    user?:IUser | null;
}

export const isAuth = async (req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({
                message:"Please Login - No auth Header",
            });
            return;
        }
        const token=authHeader.split(" ")[1] as string

        const decodeValue=jwt.verify(token,process.env.JWT_SEC as string) as JwtPayload
        if(!decodeValue || !decodeValue.user){
            res.status(401).json({
                message:"Invalid token",
            });
            return;
        }
        req.user=decodeValue.user;
        next();
        
    } catch (error) {
        console.log("JWT Verification error :",error);
        res.status(401).json({
            message:"Please Login - JWT error",
        });
    }
};

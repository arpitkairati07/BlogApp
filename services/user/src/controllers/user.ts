import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from 'jsonwebtoken';
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";

export const loginUser = TryCatch(async (req: Request, res: Response) => {
    try {
        const { email, name, image } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image
            });
        }
        const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
            expiresIn: "3d",
        });
        res.status(200).json({
            message: "Login Successful",
            token,
            user,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user,
    });
});

export const getUserProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({
            message:"User not found"
        });
        return;
    }
    res.status(200).json({
        message:"User fetched successfully",
        user
    });
})
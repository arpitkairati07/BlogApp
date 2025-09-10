import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from 'jsonwebtoken';
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import {v2 as cloudinary} from 'cloudinary';
import { oAuth2Client } from "../utils/GoogleConfig.js";
import axios from "axios";

// Login or Register user
export const loginUser = TryCatch(async (req: Request, res: Response) => {
    try {
        const {code} = req.body;
        if(!code){
            res.status(400).json({message:"Authorization Code is required"});
            return; 
        }

        const googleRes = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);

        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
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
// Get my profile

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

// Get user profile by id
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

// Update user profile
export const updateUser = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {name,instagram,facebook,linkedin,bio}=req.body;
    const user=await User.findByIdAndUpdate(req.user?._id,{
        name,instagram,facebook,linkedin,bio
    },{new:true});
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "3d",
    });
    res.status(200).json({
        message:"Profile updated successfully",
        token,
        user
    });
});

// Update ProfilePic
export const updateProfilePic = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const file=req.file;
    if(!file){
        res.status(400).json({
            message:"File not found"
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if(!fileBuffer || !fileBuffer.content){
        res.status(500).json({
            message:"Something went wrong"
        });
        return;
    }
    const cloud=await cloudinary.uploader.upload(fileBuffer.content,{
        folder:"blogs"
    });
    const user = await User.findByIdAndUpdate(req.user?._id,{
        image:cloud.secure_url
    },{new:true});
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "3d",
    });
    res.status(200).json({
        message:"Profile picture updated successfully",
        token,
        user
    });
});
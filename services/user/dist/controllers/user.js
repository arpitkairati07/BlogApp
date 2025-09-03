import User from "../model/User.js";
import jwt from 'jsonwebtoken';
import TryCatch from "../utils/TryCatch.js";
export const loginUser = TryCatch(async (req, res) => {
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
        const token = jwt.sign({ user }, process.env.JWT_SEC, {
            expiresIn: "3d",
        });
        res.status(200).json({
            message: "Login Successful",
            token,
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
export const myProfile = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user,
    });
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }
    res.status(200).json({
        message: "User fetched successfully",
        user
    });
});
//# sourceMappingURL=user.js.map
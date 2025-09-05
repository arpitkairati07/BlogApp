import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
    try {
        const { title, description, blogcontent, category } = req.body;

        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "File not found" });
            return;
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(500).json({ message: "Something went wrong with file buffer" });
            return;
        }

        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs"
        });

        if (!req.user || !req.user._id) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }

        const result = await sql`
            INSERT INTO blogs (title, description, blogcontent, image, category, author)
            VALUES (${title}, ${description}, ${blogcontent}, ${cloud.secure_url}, ${category}, ${req.user._id})
            RETURNING *
        `;
        res.status(201).json({
            message: "Blog created successfully",
            blog: result[0]
        });
    } catch (error: any) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
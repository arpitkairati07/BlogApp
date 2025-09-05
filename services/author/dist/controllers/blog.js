import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = TryCatch(async (req, res) => {
    try {
        const { title, description, blogcontent, category } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "File not found" });
            return;
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res
                .status(500)
                .json({ message: "Something went wrong with file buffer" });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs",
        });
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        const result = await sql `
            INSERT INTO blogs (title, description, blogcontent, image, category, author)
            VALUES (${title}, ${description}, ${blogcontent}, ${cloud.secure_url}, ${category}, ${req.user._id})
            RETURNING *
        `;
        res.status(201).json({
            message: "Blog created successfully",
            blog: result[0],
        });
    }
    catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
// Update Blog
export const updateBlog = TryCatch(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, blogcontent, category } = req.body;
        const file = req.file;
        const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;
        if (blog.length === 0) {
            res.status(404).json({ message: "Blog not found with this id" });
            return;
        }
        const currentBlog = blog[0];
        if (currentBlog.author !== req.user?._id) {
            res.status(403).json({ message: "You are not authorized to update this blog" });
            return;
        }
        let imageUrl = currentBlog.image;
        if (file) {
            const fileBuffer = getBuffer(file);
            if (!fileBuffer || !fileBuffer.content) {
                res.status(500).json({ message: "Something went wrong with file buffer" });
                return;
            }
            const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
                folder: "blogs",
            });
            imageUrl = cloud.secure_url;
        }
        const result = await sql `
      UPDATE blogs
      SET 
        title = ${title || currentBlog.title}, 
        description = ${description || currentBlog.description}, 
        blogcontent = ${blogcontent || currentBlog.blogcontent}, 
        image = ${imageUrl}, 
        category = ${category || currentBlog.category}
      WHERE id = ${id}
      RETURNING *
    `;
        res.status(200).json({
            message: "Blog updated successfully",
            blog: result[0],
        });
    }
    catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
//# sourceMappingURL=blog.js.map
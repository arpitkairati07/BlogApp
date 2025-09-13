import express from "express";
import { addComment, deleteComment, getAllBlogs, getAllComments, getSingleBlog } from "../controllers/blog.js";
import { isAuth } from "../middleware/isAuth.js";

const router=express.Router();
router.get("/blogs/all",getAllBlogs);
router.get("/blog/:id",getSingleBlog);
router.post("/comment/:id",isAuth,addComment);
router.get("/comment/:id",getAllComments);
router.delete("/comment/:id",isAuth,deleteComment);

export default router;
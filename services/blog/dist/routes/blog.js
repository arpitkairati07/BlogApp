import express from "express";
import { getAllBlogs } from "../controllers/blog.js";
const router = express.Router();
router.get("/blogs/all", getAllBlogs);
export default router;
//# sourceMappingURL=blog.js.map
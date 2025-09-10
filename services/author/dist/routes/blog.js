import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { aiDescriptionResponse, aiTitleResponse, createBlog, deleteBlog, updateBlog } from '../controllers/blog.js';
const router = express();
router.post('/blog/new', isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);
router.post("/ai/title", isAuth, aiTitleResponse);
router.post("/ai/description", isAuth, aiDescriptionResponse);
export default router;
//# sourceMappingURL=blog.js.map
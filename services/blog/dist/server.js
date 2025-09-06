import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
dotenv.config();
const app = express();
app.use("/api/v1", blogRoutes);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Blog service running on port  http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map
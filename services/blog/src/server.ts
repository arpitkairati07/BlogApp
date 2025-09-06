import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import {createClient} from 'redis' 


dotenv.config();

const app=express();

app.use("/api/v1",blogRoutes)

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_url environment variable is not set");
}

export const redisClient = createClient({ url: redisUrl });
redisClient.connect().then(()=>console.log("Connected to Redis Database")).catch(console.error)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Blog service running on port  http://localhost:${port}`);
});
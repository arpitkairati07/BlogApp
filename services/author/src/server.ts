import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import blogroutes from "./routes/blog.js";
import {v2 as cloudinary} from 'cloudinary';
import { connectRabbitMQ } from "./utils/rabbitmq.js";
import cors from "cors"; 

dotenv.config()

cloudinary.config({
    cloud_name: process.env.Cloud_name || "",
    api_key: process.env.Cloud_Api_Key || "",
    api_secret: process.env.Cloud_Api_Secret || "",
    secure: true
});

const app=express();
app.use(express.json());
app.use(cors());
connectRabbitMQ();

const port = process.env.PORT;

app.use('/api/v1', blogroutes);

async function initDB(){
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await sql`
        CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            COMMENT VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await sql`
        CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log('Database created successfully');
    } catch (error) {
        console.log(error);
    }
}

initDB().then(()=>{
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
})

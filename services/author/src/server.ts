import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";

dotenv.config()
const app=express();

const port = process.env.PORT;

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

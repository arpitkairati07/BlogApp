import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";


// Get All Blogs
export const getAllBlogs = TryCatch(async(req,res) =>{
    const {searchQuery,category}=req.query;
    let blogs
    if(searchQuery && category){
        blogs= sql`SELECT * FROM blogs WHERE (title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`} ) AND category = ${category} ORDER BY created_at DESC`;
    }else if(searchQuery){
        blogs= sql`SELECT * FROM blogs WHERE (title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`} ) ORDER BY created_at DESC`;
    }else{
        blogs= sql`SELECT * FROM blogs ORDER BY created_at DESC`;
    }
    res.status(200).json({blogs:await blogs});
});

//Get Single Song

export const getSingleBlog = TryCatch(async(req,res) =>{
    const blog =await sql `SELECT * FROM blogs WHERE id = ${req.params.id}`;

    const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0]?.author}`);
    res.status(200).json({blog:blog[0],author:data.user}); 
});
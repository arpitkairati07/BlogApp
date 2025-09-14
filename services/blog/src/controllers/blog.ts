import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { redisClient } from "../server.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";


// Get All Blogs
export const getAllBlogs = TryCatch(async(req,res) =>{
    const { searchQuery = "", category = "" } = req.query;

    const cacheKey = `blogs:${searchQuery}:${category}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        console.log(`Data coming from Redis Database`);
        res.json(JSON.parse(cached));
        return;
    }

    let blogs;
    if (searchQuery && category) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE (title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`})
            AND category = ${category}
            ORDER BY created_at DESC
        `;
    } else if (category) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE category = ${category}
            ORDER BY created_at DESC
        `;
    } else if (searchQuery) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE (title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`})
            ORDER BY created_at DESC
        `;
    } else {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
    }

    console.log(`Data coming from Postgress Database`);
    await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 1800 });
    res.status(200).json({ blogs });
});

//Get Single Blog

export const getSingleBlog = TryCatch(async(req,res) =>{

    const blogid = req.params.id;
    const cacheKey = `blog:${blogid}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        console.log(`Data coming from Redis Database`);
        res.json(JSON.parse(cached));
        return;
    }
    const blog = await sql`SELECT * FROM blogs WHERE id = ${blogid}`;

    if(blog.length===0){
        return res.status(404).json({message:"Blog Not Found"});
        return;
    }

    const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0]?.author}`);
    const ResponseData = { blog: blog[0], author: data.user };
    await redisClient.set(cacheKey, JSON.stringify(ResponseData), { EX: 1800 });
    console.log(`Data coming from Postgress Database`);
    res.status(200).json({ blog: blog[0], author: data.user });
});

export const addComment=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {id:blogid}=req.params;
    const {comment}=req.body;

    await sql`INSERT INTO comments (blogid,userid,comment,username) VALUES (${blogid},${req.user?._id},${comment},${req.user?.name}) RETURNING *`;

    res.json({message:"Comment added successfully"})
})

export const getAllComments = TryCatch(async(req,res)=>{
    const {id:blogid}=req.params;

    const comments=await sql`SELECT * FROM comments WHERE blogid=${blogid} ORDER BY created_at DESC`;
    res.json({comments})
})

export const deleteComment = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {id:commentid}=req.params;   
    const comment=await sql`SELECT * FROM comments WHERE id=${commentid} AND userid=${req.user?._id}`;
    if(comment.length===0){
        return res.status(404).json({message:"Comment not found"});
    }
    if(comment[0]?.userid!==req.user?._id){
        return res.status(403).json({message:"You are not authorized to delete this comment"});
        return;
    }
    await sql`DELETE FROM comments WHERE id=${commentid}`;
    res.json({message:"Comment deleted successfully"});
})


export const saveBlog = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {blogid}=req.params;
    const userId=req.user?._id;

    if(!blogid || !userId){
        return res.status(400).json({message:"Blog ID and User ID are required"});
        return;
    }
    const existing=await sql`SELECT * FROM savedblogs WHERE blogid=${blogid} AND userid=${userId}`;

    if(existing.length == 0){
        await sql`INSERT INTO savedblogs (blogid,userid) VALUES (${blogid},${userId})`;
        return res.json({message:"Blog saved successfully"});
        return;
    }else{
        await sql`DELETE FROM savedblogs WHERE blogid=${blogid} AND userid=${userId}`;
        return res.json({message:"Blog removed from saved blogs"});
        return;
    }
})

export const getSavedBlog = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const blogs = await sql`SELECT * FROM savedblogs WHERE userid=${req.user?._id} ORDER BY created_at DESC`;
    res.json({ blogs });
})
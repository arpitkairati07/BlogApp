import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { inValidateCache } from "../utils/rabbitmq.js";
import TryCatch from "../utils/TryCatch.js";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenAI } from "@google/genai";
import { raw } from "express";

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
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

    const result = await sql`
            INSERT INTO blogs (title, description, blogcontent, image, category, author)
            VALUES (${title}, ${description}, ${blogcontent}, ${cloud.secure_url}, ${category}, ${req.user._id})
            RETURNING *
        `;

        await inValidateCache(['blogs:*']);
    res.status(201).json({
      message: "Blog created successfully",
      blog: result[0],
    });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Update Blog

export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;
    const file = req.file;
    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
      res.status(404).json({ message: "Blog not found with this id" });
      return;
    }
    const currentBlog = blog[0]!;
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

    const result = await sql`
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
    await inValidateCache(['blogs:*', `blog:${id}`]);
    res.status(200).json({
      message: "Blog updated successfully",
      blog: result[0],
    });
  } catch (error: any) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});


// For deleting the blog
export const deleteBlog = TryCatch(async(req: AuthenticatedRequest, res) => {
  const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;
  if (blog.length === 0) {
    res.status(404).json({ message: "Blog not found with this id" });
    return; 
  }
  const currentBlog = blog[0]!;
  if (currentBlog.author !== req.user?._id) {
    res.status(403).json({ message: "You are not authorized to delete this blog" });
    return;
  }
  await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;
  await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
  await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;

      await inValidateCache(['blogs:*', `blog:${req.params.id}`]);

  res.status(200).json({ message: "Blog deleted successfully" });
});


export const aiTitleResponse = TryCatch(async (req, res) => {
  const { text } = req.body;

  const prompt = `Correct the grammar of the following blog title and return only the corrected title without any additional text, formatting, or punctuation: "${text}"`;

  const ai = new GoogleGenAI({
    apiKey: process.env.Gemmini_Api_Key as string,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let rawtext = response.text;
  if (!rawtext) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  const result = rawtext.replace(/\*\*/g, "")
    .replace(/[\r\n]+/g, "")
    .replace(/[*_`~`]/g, "")
    .trim();

  res.status(200).json({ title: result });
});

export const aiDescriptionResponse = TryCatch(async (req, res) => {
  const { title, description } = req.body;

  const prompt = description === "" 
    ? `Generate a short blog description (10-15 words) based only on this title: "${title}". Your response must be a single sentence, no options, no greetings, no extra text. Do not explain. Do not say 'here is'. Just return the description only.`
    : `Fix the grammar in the following blog description and return only the corrected sentence. Do not add anything else: "${description}"`;

  const ai = new GoogleGenAI({
    apiKey: process.env.Gemmini_Api_Key as string,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let rawtext = response.text ?? "";
  if (!rawtext.trim()) {
    res.status(200).json({ description: "" });
    return;
  }
  const result = rawtext.replace(/\*\*/g, "")
    .replace(/[\r\n]+/g, "")
    .replace(/[*_`~`]/g, "")
    .trim();

  res.status(200).json({ description: result });
});

export const aiBlogResponse = TryCatch(async (req, res) => {
  const { title, description } = req.body;
  const prompt = `Write a detailed, engaging, and informative blog post based on the following title and description. The blog should be well-structured with an introduction, body, and conclusion. Use a friendly and conversational tone, and make sure to include relevant examples or anecdotes to illustrate key points. The blog should be approximately 300-500 words long. Title: "${title}" Description: "${description}"`;

  const ai = new GoogleGenAI({
    apiKey: process.env.Gemmini_Api_Key as string,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let rawtext = response.text ?? "";
  if (!rawtext.trim()) {
    res.status(200).json({ blogcontent: "" }); 
    return;
  }
 const result = rawtext
    .replace(/[\*\_\`\~]/g, "") 
    .replace(/[\r\n]+/g, "\n")
    .replace(/\n{2,}/g, "\n") 
    .replace(/^\s+|\s+$/g, "") 
    .replace(/ +/g, " ")
    .trim(); 

  res.status(200).json({ blogcontent: result }); 
});
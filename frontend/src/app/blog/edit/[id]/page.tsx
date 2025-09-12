"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import { author_service, blog_service, userAppData } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export const blogCategories = [
  "Technology",
  "Health",
  "Travel",
  "Finance",
  "Food",
  "Lifestyle",
  "Education",
  "Entertainment",
  "Sports",
  "Study",
];

const EditBlogPage = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const router = useRouter();
  const {fetchBlogs} =userAppData();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, image: file });
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
    }),
    []
  );
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`);
      const blog = (data as { blog: any }).blog;
      setFormData({
        title: blog.title,
        description: blog.description,
        category: blog.category,
        image: blog.image,
        blogcontent: blog.blogcontent,
      });
      setContent(blog.blogcontent);
      setExistingImage(blog.image);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (id) {
    fetchBlog();
  }
}, [id]);
  const handleSubmit = async(e:any) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("blogcontent", formData.blogcontent);
    formDataToSend.append("category", formData.category);
    if (formData.image) {
      formDataToSend.append("file", formData.image);
    }
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${author_service}/api/v1/blog/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Blog updated successfully");
      router.push(`/blog/${id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter Blog Title"
              ></Input>
            </div>

            <Label>Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                value={formData.description ?? ""}
                onChange={handleInputChange}
                required
                placeholder="Enter Blog Description"
              />
            </div>

            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select a category"
                  className="cursor-pointer"
                />
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <div>
              <Label>Upload Image</Label>
              {formData.image &&
              typeof formData.image === "object" &&
              "type" in formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image as File)}
                  alt=""
                  className="w-40 h-40 object-cover rounded mb-2"
                />
              ) : typeof formData.image === "string" && formData.image ? (
                <img
                  src={formData.image}
                  alt=""
                  className="w-40 h-40 object-cover rounded mb-2"
                />
              ) : existingImage ? (
                <img
                  src={existingImage}
                  alt=""
                  className="w-40 h-40 object-cover rounded mb-2"
                />
              ) : null}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              ></Input>
            </div>

            <div>
              <Label>Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Write your blog content here... Please add Image after
                  improving your grammar and spellings.
                </p>
              </div>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent: string) => {
                  setContent(newContent);
                  setFormData({ ...formData, blogcontent: newContent });
                }}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPage;

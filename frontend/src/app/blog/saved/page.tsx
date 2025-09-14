"use client";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/loading";
import { userAppData } from "@/context/AppContext";
import React from "react";

const savedBlogs = () => {
const { blogs, savedBlogs, loading } = userAppData();

if (loading || !Array.isArray(blogs) || !Array.isArray(savedBlogs)) {
  return <Loading />;
}

  const filteredBlogs = blogs.filter((blog) =>
    savedBlogs.some((saved) => saved.blogid === blog.id.toString())
  );
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mt-2">Saved Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-4">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((e, i) => (
            <BlogCard
              key={e.id}
              id={e.id}
              image={e.image}
              title={e.title}
              description={e.description}
              time={e.created_at}
            />
          ))
        ) : (
          <p className="col-span-3 text-center">No saved blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default savedBlogs;

"use client";

import BlogCard from '@/components/BlogCard';
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { userAppData } from '@/context/AppContext'
import { Filter } from 'lucide-react'
import React from 'react'

const Blogs = () => {
  const { toggleSidebar } = useSidebar();
  const { loading, blogLoading, blogs, category, searchQuery } = userAppData();

  // Filter blogs by category and search query (frontend filtering)
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog) => {
        const blogCat = blog.category?.toLowerCase().trim();
        const selectedCat = category?.toLowerCase().trim();
        const matchesCategory =
          !selectedCat || selectedCat === "all" || blogCat === selectedCat;
        const matchesSearch =
          !searchQuery ||
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center my-5">
            <h1 className="text-3xl font-bold">Latest Blogs</h1>
            <Button onClick={toggleSidebar} className='flex items-center gap-2 px-4 bg-primary text-white'>
              <Filter size={18} />
              <span>Filter Blogs</span>
            </Button>
          </div>
          {blogLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBlogs.length === 0 ? (
                <p className='text-center text-lg'>No Blogs Found</p>
              ) : (
                filteredBlogs.map((e, i) => (
                  <div key={i} className="border rounded-lg p-4 m-2 shadow hover:shadow-lg transition duration-300">
                    <BlogCard image={e.image} title={e.title} description={e.description} id={e.id} time={e.created_at} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
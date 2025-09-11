"use client";

import BlogCard from '@/components/BlogCard';
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { userAppData } from '@/context/AppContext'
import { Filter } from 'lucide-react'
import React from 'react'

const Blogs = () => {
    const {toggleSidebar} = useSidebar();
    const {loading,blogLoading,blogs}=userAppData();
  return (
    <div>
      {loading ? <Loading></Loading> : <div className="container mx-auto px-4">
        <div className="flex justify-between items-center my-5">
          <h1 className="text-3xl font-bold">Latest Blogs</h1>
          <Button onClick={toggleSidebar} className='flex items-center gap-2 px-4 bg-primary text-white'><Filter size={18}/><span>Filter Blogs</span></Button>
        </div>
        {
          blogLoading ? <Loading></Loading> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {
              blogs?.length === 0 && <p className='text-center text-lg'>No Blogs Found</p>
            }
            {
              blogs && blogs.map((e,i)=>{
                return <div key={i} className="border rounded-lg p-4 m-2 shadow hover:shadow-lg transition duration-300">
                  <BlogCard key={i} image={e.image} title={e.title} description={e.description} id={e.id} time={e.created_at}></BlogCard>
                </div>
              })
            }
          </div>
        }
      </div> }
    </div>
  )
}

export default Blogs

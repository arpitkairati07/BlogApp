"use client"

import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { author_service, Blog, blog_service, User, userAppData } from '@/context/AppContext'
import axios from 'axios';
import { Bookmark, Edit, Trash2, Trash2Icon, User2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  userid: string;
  comment: string;
  created_at: string;
  username: string;
}

const BlogPage = () => {

    const{isAuth,user,fetchBlogs} =userAppData();
    const router = useRouter();
    const{id} = useParams();
    const[blog,setBlog]=useState<Blog | null>(null);
    const[author,setAuthor]=useState<User | null>(null);
    const[loading,setLoading]=useState<boolean>(false);
    const[comment,setComment]=useState<string>("");
    const[comments,setComments]=useState<Comment[]>([]);


async function fetchComment() {
  try {
    setLoading(true);
    const { data } = await axios.get(`${blog_service}/api/v1/comment/${id}`);
    const commentsData = (data as { comments: Comment[] }).comments; 
    setComments(commentsData);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    fetchComment();
  }, [id]);

async function fetchSingleBlog() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`);
      const response = data as { blog: Blog; author: User }; 
    setBlog(response.blog);
    setAuthor(response.author);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

const deleteComment = async (id: string) => {
  if (confirm("Are you sure you want to delete this comment")) {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.delete(
        `${blog_service}/api/v1/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = data as { message: string }; 
      toast.success(response.message);
      fetchComment();
    } catch (error) {
      toast.error("Problem while deleting comment");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
};

async function deletBlog() {
    if (confirm("Are you sure you want to delete this blog")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${author_service}/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response = data as { message: string }; 
      toast.success(response.message);
        router.push("/blogs");
        fetchBlogs?.();
        setTimeout(() => {
          fetchBlogs?.();
        }, 4000);
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }


    
    async function addComment(){
      try {
        setLoading(true);
        const token=Cookies.get("token") as string;
        const { data } = await axios.post(`${blog_service}/api/v1/comment/${id}`,{comment},{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }); 
        toast.success("Comment added successfully");
        setComment("");
        fetchComment();
      } catch (error) {
        toast.error("Something went wrong");
      }finally{
        setLoading(false);
      }
    }



    useEffect(()=>{
        fetchSingleBlog();
    },[id])

    if(!blog || !author){
        return <Loading></Loading>
    }
  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
            <p className="text-gray-600 mt-2 flex items-center">
                <Link className='flex items-center gap-2' href={`/profile/${author?._id}`}><img src={author?.image} alt="Author Image" className='w-10 h-10 rounded-full mr-2' />{author?.name}</Link>
                {
                    isAuth && <Button variant={'ghost'} className='mx-3 cursor-pointer' size={'lg'}><Bookmark></Bookmark></Button>
                }
                {
                    blog.author === author._id && 
                    <>
                    <Button size={'sm'} className='cursor-pointer' onClick={() => router.push(`/blog/edit/${id}`)}><Edit></Edit></Button>
                    <Button size={'sm'} variant={'destructive'} className='mx-2 cursor-pointer' onClick={deletBlog} disabled={loading}><Trash2Icon></Trash2Icon></Button>
                    </>
                }
            </p>
        </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden h-96">
                <img
                src={blog.image}
                alt={blog.title}
                className="object-contain h-full w-full rounded-lg"
                />
            </div>
            <div className="flex-1">
                <p className="text-lg text-gray-700 mb-4">{blog.description}</p>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.blogcontent }} />
            </div>
            </CardContent>
      </Card>
      {
        isAuth && 
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900">Leave a Comment</h3>
          </CardHeader>
          <CardContent>
            <Label htmlFor='comment'>Your Comment</Label>
            <Input id='comment' placeholder='Write your comment here...' className='my-2' value={comment} onChange={(e) => setComment(e.target.value)} />
            <Button className='cursor-pointer' onClick={addComment} disabled={loading}>{loading ? "Posting...." : "Post Comment"}</Button>
          </CardContent>
        </Card>
      }
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">All Comments</h3>
        </CardHeader>
        <CardContent>
           {
            comments && comments.length > 0 ? comments.map((e,i)=>{
              return <div key={i} className='border-b py-2 flex items-center gap-3'>
                <div>
                  <p className="font-semibold flex items-center gap-1"><span className="user border border-gray-600 rounded-full p-1">
                    <User2></User2></span>{e.username}</p>
                    <p>{e.comment}</p>
                    <p className="text-xs text-gray-500">
                    {new Date(e.created_at).toLocaleString()}</p>
                </div>
                    {e.userid === user?._id && (
                    <Button
                    className='cursor-pointer ml-auto'
                      onClick={() => deleteComment(e.id)}
                      variant={"destructive"}
                      disabled={loading}
                    >
                      <Trash2 />
                    </Button>
                  )}
              </div>
            }) : <p>No comments yet..</p>
           }
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogPage

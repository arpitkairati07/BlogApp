"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

interface savedBlogType{
  id : string;
  blogid : string;
  userid : string;
  created_at : string;
}

interface AppContextType {
  user: User | null;
  loading:boolean;
  isAuth:boolean;
  logOutUser?:()=>Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading : React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth : React.Dispatch<React.SetStateAction<boolean>>;
  blogs?:Blog[] | null;
  blogLoading?:boolean;
  setSearchQuery?:React.Dispatch<React.SetStateAction<string>>;
  searchQuery?:string;
  category?:string;
  setCategory?:React.Dispatch<React.SetStateAction<string>>;
  fetchBlogs?:()=>Promise<void>;
  savedBlogs?:savedBlogType[] | null;
  getSavedBlogs?:()=>Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchUser() {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = data as { user: User };
    setUser(response.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  }

  const [blogLoading, setBlogLoading] = useState(true);
  const[blogs,setBlogs]=useState<Blog[] | null>([]);
  const[category,setCategory]=useState<string>("");
  const[searchQuery,setSearchQuery]=useState<string>("");

  async function fetchBlogs() {
    setBlogLoading(true);
    try {
      const { data } = await axios.get(`${blog_service}/api/v1/blogs/all?searchQuery=${searchQuery}&category=${category}`);

      const blogs = data as Blog[]; 
      setBlogs(blogs);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    } finally {
      setBlogLoading(false);
    }
  }
  const[savedBlogs,setSavedBlogs]=useState<savedBlogType[] | null>([]);
  async function getSavedBlogs(){
    try {
      const {data} = await axios.get(`${blog_service}/api/v1/blog/saved/all`,{
        headers:{
          Authorization:`Bearer ${Cookies.get("token")}`
        }
      });
      const saved = data as savedBlogType[];
      setSavedBlogs(saved);
    } catch (error) {
      console.log(error);
    }
  }

  async function logOutUser(){
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }
  useEffect(() => {
    fetchUser();
    getSavedBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [category,searchQuery]);

  return (
    <AppContext.Provider value={{ user,setIsAuth,isAuth,loading,setLoading,setUser,logOutUser,blogs,blogLoading,setCategory,setSearchQuery,searchQuery,category,fetchBlogs,savedBlogs,getSavedBlogs }}>
      <GoogleOAuthProvider clientId="1044738267238-fr4rohnkefmoecku7eetdi04ddva9201.apps.googleusercontent.com">
        {children}
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const userAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};

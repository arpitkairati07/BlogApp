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

interface AppContextType {
  user: User | null;
  loading:boolean;
  isAuth:boolean;
  logOutUser?:()=>Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading : React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth : React.Dispatch<React.SetStateAction<boolean>>;
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

  async function logOutUser(){
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AppContext.Provider value={{ user,setIsAuth,isAuth,loading,setLoading,setUser,logOutUser }}>
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

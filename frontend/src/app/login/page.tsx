"use client";

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { user_service, userAppData } from '@/context/AppContext'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import axios from 'axios'
import {useGoogleLogin} from '@react-oauth/google'
import { redirect } from 'next/navigation';
import Loading from '@/components/loading';

const LoginPage = () => {
  const {isAuth,user,setIsAuth, loading, setLoading}=userAppData();
  if(isAuth){
    return redirect("/");
  }
    const responseGoogle = async(authResult : any) =>{
        try {
            const result=await axios.post(`${user_service}/api/v1/login`,{
                code:authResult["code"]
            })
            const data = result.data as {token:string,message:string};
            Cookies.set("token",data.token,{
                expires:3,
                secure:true,
                path:"/"
            });
            toast.success(data.message)
        } catch (error) {
            toast.error("Login failed")
        }
    };
    const googleLogin = useGoogleLogin({
        onSuccess : responseGoogle,
        onError:responseGoogle,
        flow:"auth-code",

    })
  return (
    <>
    {loading ? (<Loading></Loading> ):(
          <div className='w-[350px] m-auto mt-[200px]'>
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle >Login to Reading Retreat</CardTitle>
        <CardDescription>
          Your go to BlogApp
        </CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={googleLogin}>
          Login with Google <img src={'/image.png'} className='w-6 h-6 rounded-full' alt="Google Icon" />
        </Button>
      </CardFooter>
    </Card>
    </div>
    ) 
    }
    </>
  )
}

export default LoginPage

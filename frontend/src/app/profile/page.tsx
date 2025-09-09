"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { user_service, userAppData } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";

const ProfilePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const changeHandler = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post(
          `${user_service}/api/v1/user/update/pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = data as { token: string; user: typeof user };

        toast.success("Profile picture updated successfully");
        setLoading(false);
        Cookies.set("token", responseData.token, {
          expires: 3,
          secure: true,
          path: "/",
        });
        setUser(responseData.user);
      } catch (error) {
        toast.error("Failed to upload image");
        setLoading(false);
      }
    }
  };
  const { user, setUser } = userAppData();
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading></Loading>
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-28 h-28 border-4 border-blue-600 shadow-md cursor-pointer" onClick={clickHandler}>
                <AvatarImage
                  src={user?.image}
                  alt="Profile Picture"
                ></AvatarImage>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={inputRef}
                  onChange={changeHandler}
                />
              </Avatar>
              
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;

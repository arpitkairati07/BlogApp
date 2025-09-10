"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { user_service, userAppData } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, setUser,logOutUser } = userAppData();

  if(!user){
    return redirect('/login');
  }

  const logOutHandler = () =>{
    if(logOutUser){
      logOutUser();
    }
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    facebook: user?.facebook || "",
    instagram: user?.instagram || "",
    linkedin: user?.linkedin || ""
  });

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
        localStorage.setItem("user", JSON.stringify(responseData.user)); // persist user
      } catch (error) {
        toast.error("Failed to upload image");
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${user_service}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = data as { token: string; user: typeof user };
      toast.success("Profile updated successfully");
      setLoading(false);
      Cookies.set("token", responseData.token, {
        expires: 3,
        secure: true,
        path: "/",
      });
      setUser(responseData.user);
      localStorage.setItem("user", JSON.stringify(responseData.user)); // persist user
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-28 h-28 border-4 border-blue-600 shadow-md cursor-pointer" onClick={clickHandler}>
                <AvatarImage
                  src={user?.image}
                  alt="Profile Picture"
                />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={inputRef}
                  onChange={changeHandler}
                />
              </Avatar>
              <div className="w-full space-y-2 text-center">
                <label className="font-medium">Name</label>
                <p>{user?.name}</p>
              </div>
              {user?.bio && (
                <div className="w-full space-y-2 text-center">
                  <label className="font-medium">Bio</label>
                  <p>{user.bio}</p>
                </div>
              )}
              <div className="flex gap-4 mt-3">
                {user?.instagram && (
                  <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="text-pink-500 text-2xl" />
                  </a>
                )}
                {user?.facebook && (
                  <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="text-blue-500 text-2xl" />
                  </a>
                )}
                {user?.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="text-blue-700 text-2xl" />
                  </a>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
                <Button onClick={logOutHandler}>LogOut</Button>
                <Button onClick={()=>router.push('/blog/new')}>Add Blog</Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}></Input>
                      </div>
                      <div>
                        <Label>Bio</Label>
                        <Input value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}></Input>
                      </div>
                      <div>
                        <Label>Instagram</Label>
                        <Input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}></Input>
                      </div>
                      <div>
                        <Label>Facebook</Label>
                        <Input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}></Input>
                      </div>
                      <div>
                        <Label>LinkedIn</Label>
                        <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}></Input>
                      </div>
                      <Button onClick={handleFormSubmit} className="w-full mt-4">Update</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
"use client";
import HomeLayout from '@/components/homelayout';
import Loading from '@/components/loading';
import { userAppData } from '@/context/AppContext';
import React from 'react'

const Home = () => {
  const {loading,blogLoading,blogs}=userAppData();
  return (
    <HomeLayout>
      <div>{loading ? <Loading></Loading> : <div className="container mx-auto px-4"></div> }</div>
    </HomeLayout>
  )
}

export default Home;

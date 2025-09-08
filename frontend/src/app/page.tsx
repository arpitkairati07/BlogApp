"use-client";
import Loading from '@/components/loading';
import { userAppData } from '@/context/AppContext';
import React from 'react'

const Home = () => {
  const {loading}=userAppData();
  return (
    <div>{loading ? <Loading></Loading> : "Welcome to the BlogApp!"}</div>
  )
}

export default Home;

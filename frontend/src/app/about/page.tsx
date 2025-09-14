import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold mb-4">About BlogApp</h1>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">
            Welcome to <span className="font-semibold">BlogApp</span>! This platform lets you explore, create, and share blogs on a wide range of topics. Whether you're passionate about technology, lifestyle, education, or personal stories, you'll find something interesting here.
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Browse and read blogs from various authors.</li>
            <li>Comment on posts and join the discussion.</li>
            <li>Save your favorite blogs for quick access.</li>
            <li>Create, edit, and manage your own blog posts.</li>
          </ul>
          <p className="text-gray-600">
            Our mission is to build a friendly and engaging community for readers and writers. Thank you for being a part of BlogApp!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
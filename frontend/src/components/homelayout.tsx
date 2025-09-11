import React, { ReactNode } from 'react';
import { SidebarProvider } from './ui/sidebar';
import SideBar from './sidebar';

interface BlogsProps {
    children: ReactNode; 
}

const HomeLayout: React.FC<BlogsProps> = ({ children }) => {
  return (
    <div>
      <SidebarProvider>
        <SideBar></SideBar>
          <main className='w-full'>
            <div className="w-full min-h-[calc(100vh - 45)] px-4">{children}</div>
          </main>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;
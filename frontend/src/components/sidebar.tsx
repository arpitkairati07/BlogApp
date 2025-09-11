import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'
import { Input } from './ui/input'
import { BoxSelect } from 'lucide-react'

const SideBar = () => {
  const blogCategories = [
    "Technology",
    "Health",
    "Travel",
    "Finance",
    "Food",
    "Lifestyle",
    "Education",
    "Entertainment",
    "Sports",
    "Study",
    "Other",
  ];
  return (
    <Sidebar>
      <SidebarHeader className='bg-white text-2xl font-bold mt-5'>
        The Reading Retreat
      </SidebarHeader>
      <SidebarContent className='bg-white'>
        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <Input type='text' placeholder='Search your desired blog' />
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BoxSelect />
                <span>All</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {blogCategories.map((e, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton>
                  <BoxSelect />
                  <span>{e}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SideBar
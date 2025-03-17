'use client'
import { useRole } from '@/app/Providers/ContextProvider'
import { useUser } from '@auth0/nextjs-auth0/client'
import { LogIn, LogOut, Shield } from 'lucide-react'
import React from 'react'

const Admincard = () => {
 const { role } = useRole()
   const { user } = useUser()
  return (
    <div> 
        <div  className=" space-x-2 bg-white p-2 rounded-md   flex items-center">
        
        <Shield  fill={role=="ADMIN"?"lightgreen":"red"} />
        <div className=' flex flex-col items-start justify-center'>
        {
            user && <p className=" hidden md:flex text-sm ">{user.name}</p>
        }
    <p className=" hidden md:flex text-xs font-bold  ">
        {role=="ADMIN"?"ADMIN":"USER"}</p> 
        </div>
      
    {
        role!="ADMIN"? <a href="api/auth/login"> 
        <LogIn className=' cursor-pointer'/> </a>: <a  href='api/auth/logout'>
          
          <LogOut className=' cursor-pointer'/></a>
    }
     
    </div>
    </div>
  )
}

export default Admincard
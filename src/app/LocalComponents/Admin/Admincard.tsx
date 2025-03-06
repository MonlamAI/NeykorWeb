'use client'
import { useRole } from '@/app/Providers/ContextProvider'
import { useUser } from '@auth0/nextjs-auth0/client'
import { LogIn, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Admincard = () => {
 const { role } = useRole()
   const { user } = useUser()
  return (
    <div> 
        <div  className="absolute space-x-2 border p-2 rounded-md dark:text-black hover:bg-neutral-200   bottom-5 flex items-center left-10">
        
        <Shield  fill={role=="ADMIN"?"lightgreen":"red"} />
        <div className=' flex flex-col items-start justify-center'>
        {
            user && <p className=" hidden md:flex text-sm ">{user.name}</p>
        }
    <p className=" hidden md:flex text-xs font-bold  ">
        {role=="ADMIN"?"ADMIN":"USER"}</p> 
        </div>
      
    {
        role!="ADMIN"? <Link href="api/auth/login"> <LogIn className=' cursor-pointer'/> </Link>: <Link  href='api/auth/logout'><LogOut className=' cursor-pointer'/></Link>
    }
     
    </div>
    </div>
  )
}

export default Admincard
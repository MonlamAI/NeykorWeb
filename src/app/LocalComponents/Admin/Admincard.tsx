'use client'
import { useRole } from '@/app/Providers/ContextProvider'
import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, Shield } from 'lucide-react'
import React from 'react'

const Admincard = () => {
 const { role } = useRole()
   const { data: session } = useSession()
   const user = session?.user
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
        role!="ADMIN"? <button type="button" onClick={() => signIn("google")}> 
        <LogIn className=' cursor-pointer'/> </button>: <button type="button" onClick={() => signOut()}>
          
          <LogOut className=' cursor-pointer'/></button>
    }
     
    </div>
    </div>
  )
}

export default Admincard

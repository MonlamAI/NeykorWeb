'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Pencil, Trash, LogOut, LogIn } from "lucide-react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRole } from '@/app/Providers/ContextProvider'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { deleteuser } from '@/app/actions/delaction'
import { updateUser } from '@/app/actions/updateaction'

interface User {
  username: string;
  email: string;
  role: string;
  id: string;
}

interface AccessClientProps {
  users: User[];
}

const AccessClient = ({ users: initialUsers }: AccessClientProps) => {
  const { user } = useUser()
  const { role } = useRole()
  const { toast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: ''
  })

  const handleDelete = async (email: string) => {
    try {
      await deleteuser(email)
      setUsers(users.filter(user => user.email !== email))
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      })
      console.error('Delete error:', error)
    }
  }

  const handleUpdate = async (email: string) => {
    try {
      const response = await updateUser(email, editForm)
      setUsers(users.map(user => 
        user.email === email ? { ...user, ...editForm } : user
      ))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      })
      console.error('Update error:', error)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    })
    setIsEditDialogOpen(true)
  }
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/access'
 
  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="">
        <div className="p-6">
          {user && role === "ADMIN" ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  User Management <span className='text-sm font-normal text-neutral-700 dark:text-neutral-400'>Current Session: {user.name}</span>
                </h2>
                
                <Link
                  href={`/api/auth/logout?returnTo=${encodeURIComponent(currentPath)}`}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white dark:bg-neutral-900 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </div>
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-neutral-900">
                      <TableHead className="w-[200px]">Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user: User) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "ADMIN" ? "bg-red-200 text-red-800" : "text-blue-800 bg-blue-100"
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openEditDialog(user)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(user.email)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={editForm.role}
                        onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleUpdate(selectedUser?.email || '')}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="text-center  py-40">
              {
                user && role != "ADMIN" && (
                    <Link
                  href={`/api/auth/logout?returnTo=${encodeURIComponent(currentPath)}`}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white dark:bg-neutral-900 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
                )
              }
             
            </div>
          )}
           {
            user && role != "ADMIN" || !user && (
              <div className="text-center">
                <h1 className="text-xl text-neutral-900 dark:text-neutral-100">
                  You are not authorized to access this page
                </h1>
                <Link href="/" className="text-sm text-neutral-900 dark:text-neutral-100">Go to Home</Link>
              </div>
            )
           }
        </div>
      </div>
    </div>
  )
}

export default AccessClient


"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { getRole } from "../actions/getactions";

const RoleContext = createContext({
  role: ""
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchRole() {
      if (user?.email) {
        try {
          const userRole = await getRole(user.email);
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole("");
      }
    }
    fetchRole();
  }, [user]);

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

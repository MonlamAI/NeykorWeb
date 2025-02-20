"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getRole } from "../actions/getactions";

const RoleContext = createContext({
  role: ""
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        try {
          if (user.email) {
            const userRole = await getRole(user.email);
            setRole(userRole);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
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

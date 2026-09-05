"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "retail" | "dealer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  gstin?: string;
  phone?: string;
  dealerStatus?: "pending" | "approved" | "rejected" | "none";
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isDealer: boolean;
  isAdmin: boolean;
  setUserRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  retail: {
    id: "user-retail-1",
    name: "Rahul Sharma",
    email: "customer@nafilocks.com",
    role: "retail",
    dealerStatus: "none",
  },
  dealer: {
    id: "user-dealer-1",
    name: "Vikram Mehta",
    email: "dealer@hardwarehub.in",
    role: "dealer",
    companyName: "Hardware Hub Pvt Ltd",
    gstin: "27AAACH1234F1Z9",
    dealerStatus: "approved",
  },
  admin: {
    id: "user-admin-1",
    name: "Nafi Master Admin",
    email: "admin@nafilocks.com",
    role: "admin",
    dealerStatus: "none",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USERS.retail);

  const loginAs = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const setUserRole = (role: UserRole) => {
    loginAs(role);
  };

  const logout = () => {
    setUser(null);
  };

  const role = user?.role || "retail";
  const isDealer = role === "dealer" && user?.dealerStatus === "approved";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider value={{ user, role, isDealer, isAdmin, setUserRole, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

"use client";

import { useState, useEffect } from "react";

interface User {
  email: string;
  role: string;
  fullName: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  return {
    user,
    loading,
    isAuthenticated,
    isCustomer,
    isAdmin,
  };
}

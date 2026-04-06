import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 1. Grab the token
  const token = localStorage.getItem("token");


  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // 3. Return children wrapped in a fragment
  return <>{children}</>;
}
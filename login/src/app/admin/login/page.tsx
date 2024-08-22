"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaEnvelope } from "react-icons/fa";

export default function AdminLogin() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await signIn("credentials", {
      email: authState.email,
      password: authState.password,
      redirect: false,
    });

    if (data?.status === 200) {
      router.replace("/admin/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Admin Login</h1>
          <p className="mb-6 text-gray-600">Welcome back, please login to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <FaEnvelope className="text-gray-500 ml-3" />
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full p-3 border-none outline-none"
                onChange={(e) => setAuthState({ ...authState, email: e.target.value })}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <FaLock className="text-gray-500 ml-3" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border-none outline-none"
                onChange={(e) => setAuthState({ ...authState, password: e.target.value })}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

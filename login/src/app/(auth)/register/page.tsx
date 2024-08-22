"use client"; // Add this directive to indicate client-side rendering

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiUserCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function Register() {
    const router = useRouter();
    
    const [authState, setAuthState] = useState({
        wardNumber: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<registerErrorType>();

    const submitForm = () => {
        setLoading(true);
        axios.post("/api/auth/register", authState)
            .then((res) => {
                setLoading(false);
                const response = res.data;
                if (response.status === 200) {
                    router.push("/login?message=Account created successfully");
                } else if (response?.status === 400) {
                    setErrors(response?.errors);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log("Something went wrong");
            });
    };

    const githubSignin = () => {
        if (authState.wardNumber) {
            signIn('github', { callbackUrl: "/", wardNumber: authState.wardNumber });
        } else {
            console.log("Ward number is required");
        }
    };

    const googleLogin = async () => {
        if (authState.wardNumber) {
            await signIn("google", { callbackUrl: "/", wardNumber: authState.wardNumber });
        } else {
            console.log("Ward number is required");
        }
    };

    return (
        <section className="bg-gray-500 min-h-screen flex items-center justify-center px-4 py-10">
            <div className="flex items-center justify-center w-full max-w-lg px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full">
                    <form action="#" method="POST" className="flex flex-col justify-center h-full">
                        <div className="mb-4 flex justify-center">
                            <FiUserCheck size={50} color="black" />
                        </div>
                        <h2 className="text-center text-2xl font-bold leading-tight text-black">
                            Sign up to create an account
                        </h2>
                        <p className="mt-2 text-center text-base text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" title="" className="font-medium text-black transition-all duration-200 hover:underline">
                                Sign In
                            </Link>
                        </p>
                        <div className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="ward-number" className="text-base font-medium text-gray-900 flex items-center">
                                    <FaUser className="mr-2" /> Ward Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="Ward Number"
                                        id="wardNumber"
                                        min="0"
                                        onChange={(e) => {
                                            setAuthState({
                                                ...authState,
                                                wardNumber: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.wardNumber && (
                                        <span className="text-red-500 text-sm">
                                            {errors?.wardNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="text-base font-medium text-gray-900 flex items-center">
                                    <FaEnvelope className="mr-2" /> Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        onChange={(e) => {
                                            setAuthState({
                                                ...authState,
                                                email: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.email && (
                                        <span className="text-red-500 text-sm">
                                            {errors?.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="text-base font-medium text-gray-900 flex items-center">
                                    <FaLock className="mr-2" /> Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Password"
                                        id="password"
                                        onChange={(e) => {
                                            setAuthState({
                                                ...authState,
                                                password: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.password && (
                                        <span className="text-red-500 text-sm">
                                            {errors?.password}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password_confirmation" className="text-base font-medium text-gray-900 flex items-center">
                                    <FaLock className="mr-2" /> Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Confirm Password"
                                        id="password_confirmation"
                                        onChange={(e) => {
                                            setAuthState({
                                                ...authState,
                                                password_confirmation: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.password_confirmation && (
                                        <span className="text-red-500 text-sm">
                                            {errors?.password_confirmation}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button
                                onClick={submitForm}
                                type="button"
                                className={`inline-flex h-10 w-full items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${loading && "opacity-60"}`}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-8">
                            <p className="text-sm font-medium text-gray-600">
                                Or sign up with
                            </p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={googleLogin}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-base font-medium text-gray-600 shadow-sm transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    <FcGoogle size={24} />
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={githubSignin}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-base font-medium text-gray-600 shadow-sm transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    <FaGithub size={24} />
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
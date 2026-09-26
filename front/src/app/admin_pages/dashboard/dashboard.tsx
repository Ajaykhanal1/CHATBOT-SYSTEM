"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/axios/axios";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Student from "./student";
import Teacher from "./teacher";
import Course from "./course";
import Attendance from "./Attendance";
import Notice from "./Notice";

export default function Dashboard() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split(".")[1]));

                if (payload.role !== "admin") {
                    router.replace("/login");
                    return;
                }


            } catch {
                localStorage.removeItem("token");
                router.replace("/login");
            }
        };

        checkAuth();
    }, [router]);


    const uploadPDF = async () => {
        if (!file) {
            setMessage("Please select a PDF");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const { data } = await api.post(
                "/documents/upload",
                formData
            );

            setMessage(data.message);
            setFile(null);
            fileInputRef.current!.value = "";
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log("STATUS:", error.response?.status);
                console.log("DATA:", error.response?.data);
                console.log("ERROR:", error.message);

                setMessage(
                    error.response?.data?.message || error.message
                );
            } else {
                console.log(error);
                setMessage("Upload failed");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 ">
            <div className="max-w-5xl mx-auto rounded-lg bg-white p-8 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        <button className="bg-black text-white px-2 py-1 rounded-md cursor-pointer" onClick={() => {
                            if (confirm("Are you sure you want to logout?")) {
                                localStorage.removeItem("token");
                            }
                        }}>
                            Logout
                        </button>
                    </h1></div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="mx-auto w-full max-w-5xl">



                        {/* Students */}
                        <Student />



                        {/* Teachers */}
                        <Teacher />


                        {/* Courses */}
                        <Course />


                        {/* Attendance */}
                        <Attendance />


                        {/* Notices */}
                        <Notice />
                    </div>



                    {/* Right Column */}
                    <div className="mx-auto w-full max-w-5xl">
                        <p className="mb-4 text-gray-600">
                            Manage college data and chatbot knowledge.
                        </p>

                        {/* Existing PDF Upload */}
                        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="mb-2 text-xl font-semibold">Upload PDF</h2>

                            <p className="mb-4 text-sm text-gray-500">
                                Select a PDF file from your computer.
                            </p>

                            <label className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:bg-gray-50">
                                <span className="mb-2 text-4xl">📄</span>

                                <span className="text-sm font-medium">
                                    {file ? file.name : "Choose PDF file"}
                                </span>

                                <span className="mt-1 text-xs text-gray-500">
                                    PDF files only
                                </span>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        setFile(e.target.files?.[0] || null);
                                    }}
                                />
                            </label>

                            <button
                                onClick={uploadPDF}
                                disabled={!file}
                                className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white disabled:bg-gray-300"
                            >
                                Upload PDF
                            </button>

                            {message && (
                                <p className="mt-4 rounded-md bg-gray-50 p-3 text-center text-sm">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>


                </div>
            </div>


        </div>
    );
}
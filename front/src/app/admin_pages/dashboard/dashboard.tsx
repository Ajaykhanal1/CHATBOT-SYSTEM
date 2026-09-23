"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/axios/axios";
import axios from "axios";

export default function Dashboard() {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");

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
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="mb-8 text-gray-600">
                    Upload PDF documents to your chatbot knowledge base.
                </p>

                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        Upload PDF
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Select a PDF file from your computer.
                    </p>

                    <label className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 transition hover:border-gray-500 hover:bg-gray-50">
                        <span className="mb-2 text-4xl">📄</span>

                        <span className="text-sm font-medium text-gray-700">
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
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />
                    </label>

                    <button
                        onClick={uploadPDF}
                        disabled={!file}
                        className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        Upload PDF
                    </button>

                    {message && (
                        <p className="mt-4 rounded-md bg-gray-50 p-3 text-center text-sm text-gray-700">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
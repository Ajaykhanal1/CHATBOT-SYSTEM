"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/axios/axios";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("knowledge");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const { data } = await api.post("/documents/upload", formData);

      setMessage(data.message);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || error.message);
      } else {
        setMessage("Upload failed");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const tabs = [
    { id: "knowledge", label: "Knowledge Base" },
    { id: "students", label: "Students" },
    { id: "teachers", label: "Teachers" },
    { id: "courses", label: "Courses" },
    { id: "attendance", label: "Attendance" },
    { id: "notices", label: "Notices" },
  ];

  const selectTab = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const tabList = (
    <div className="relative space-y-1 p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => selectTab(tab.id)}
          className={`flex w-full items-center rounded-2xl px-4 py-3 text-sm transition-all ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground shadow-lg shadow-primary/10"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="admin-scale relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px] bg-noise" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px] bg-grid opacity-30" />
      
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
            </span>
            <h1 className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl">
              MyChat Admin
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pt-20 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto h-full max-w-[1600px] px-3 sm:px-4 lg:px-6">

          <div className="grid h-full gap-3 md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-2 shadow-2xl backdrop-blur-xl md:block">
              <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              {tabList}
            </aside>

            {/* Main Content */}
            <div className="h-full">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
                <div className="relative flex h-full flex-col overflow-y-auto">
                  {activeTab === "students" && <Student />}
                  {activeTab === "teachers" && <Teacher />}
                  {activeTab === "courses" && <Course />}
                  {activeTab === "attendance" && <Attendance />}
                  {activeTab === "notices" && <Notice />}
                  {activeTab === "knowledge" && (
                    <>
                      <div className="mb-5 shrink-0">
                        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            Knowledge Base
                          </span>
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Upload PDF documents to train the chatbot
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
                        <label className="group flex min-h-[240px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-8 text-center transition-all hover:border-primary/40 hover:bg-white/5">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
                            <span className="text-2xl">📄</span>
                          </div>
                          <span className="mb-1 text-sm font-medium">
                            {file ? file.name : "Drop PDF here or click to browse"}
                          </span>
                          <span className="text-xs text-muted-foreground">
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

                        <div className="flex w-full flex-col gap-3 lg:w-72">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-medium">How it works</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Upload a PDF and its contents are indexed so the
                              chatbot can answer questions from it.
                            </p>
                          </div>

                          <div className="mt-auto flex flex-col gap-3">
                            {message && (
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm">
                                {message}
                              </div>
                            )}

                            <button
                              onClick={uploadPDF}
                              disabled={!file}
                              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:hover:shadow-none"
                            >
                              <span className="relative z-10">
                                {file ? "Upload PDF" : "Select a file first"}
                              </span>
                              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] md:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col border-r border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
            <span className="text-sm font-semibold tracking-tight">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{tabList}</div>
        </aside>
      </div>
    </div>
  );
}

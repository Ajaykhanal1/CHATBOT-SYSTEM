"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldGroup,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios/axios";

interface Notice {
  _id: string;
  title: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function Notice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Automatically set current date and time
  const [publishedAt, setPublishedAt] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);

  // Get notices
  const getNotices = async () => {
    try {
      const response = await api.get("/admin/notices");
      setNotices(response.data);
    } catch (error) {
      console.error("Get notices error:", error);
    }
  };

  // Load notices
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const response = await api.get("/admin/notices");
        setNotices(response.data);
      } catch (error) {
        console.error("Get notices error:", error);
      }
    };

    loadNotices();
  }, []);

  // Create notice
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await api.post("/admin/notices", {
        title,
        content,
        publishedAt: new Date(publishedAt).toISOString(),
      });

      setMessage(
        response.data.message ||
          "Notice created successfully"
      );

      // Reset form
      setTitle("");
      setContent("");

      // Reset date/time to current date/time
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(
        now.getTime() - offset * 60000
      );

      setPublishedAt(
        localDate.toISOString().slice(0, 16)
      );

      // Refresh notices
      await getNotices();
    } catch (error: unknown) {
      console.error("Create notice error:", error);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            "Failed to create notice"
        );
      } else {
        setMessage("Failed to create notice");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete notice
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/notices/${id}`);

      setNotices((prev) =>
        prev.filter((notice) => notice._id !== id)
      );
    } catch (error: unknown) {
      console.error("Delete notice error:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to delete notice"
        );
      } else {
        alert("Failed to delete notice");
      }
    }
  };

  return (
    <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
      <h2 className="text-lg font-semibold">
        📢 Notices
      </h2>

      <div className="mt-2 flex flex-wrap gap-2">

        {/* Create Notice */}
        <Dialog>
          <DialogTrigger
            render={
              <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                Create Notice
              </Button>
            }
          />

          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  Create Notice
                </DialogTitle>

                <DialogDescription>
                  Create a new college notice.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="mt-4">

                {/* Title */}
                <Field>
                  <Label htmlFor="title">
                    Notice Title
                  </Label>

                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter notice title"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    required
                  />
                </Field>

                {/* Content */}
                <Field>
                  <Label htmlFor="content">
                    Notice Content
                  </Label>

                  <textarea
                    id="content"
                    placeholder="Enter notice content"
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                    required
                    rows={5}
                    className="w-full resize-none rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
                  />
                </Field>

                {/* Published Date */}
                <Field>
                  <Label htmlFor="publishedAt">
                    Published Date & Time
                  </Label>

                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) =>
                      setPublishedAt(e.target.value)
                    }
                    required
                  />
                </Field>

              </FieldGroup>

              {/* Message */}
              {message && (
                <p className="mt-3 rounded-md bg-gray-50 p-2 text-center text-sm">
                  {message}
                </p>
              )}

              <DialogFooter className="mt-4">

                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  }
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating..."
                    : "Create Notice"}
                </Button>

              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Manage Notices */}
        <Dialog
          open={isListOpen}
          onOpenChange={setIsListOpen}
        >
          <DialogTrigger
            render={
              <Button
                variant="outline"
                className="rounded-md px-3 py-1.5 text-sm"
              >
                Manage Notices
              </Button>
            }
          />

          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">

            <DialogHeader>
              <DialogTitle>
                Manage Notices
              </DialogTitle>

              <DialogDescription>
                View and delete college notices.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">

              {notices.length === 0 ? (
                <div className="rounded-md border p-4 text-center text-sm text-gray-500">
                  No notices found.
                </div>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3 className="font-semibold">
                          {notice.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                          {notice.content}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Published:{" "}
                          {new Date(
                            notice.publishedAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(notice._id)
                        }
                      >
                        Delete
                      </Button>

                    </div>
                  </div>
                ))
              )}

            </div>

            <DialogFooter className="mt-4">
              <DialogClose
                render={
                  <Button variant="outline">
                    Close
                  </Button>
                }
              />
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
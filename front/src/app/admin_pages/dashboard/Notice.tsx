"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios/axios";

export default function Notice() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addNotice = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.post("/admin/notices", {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      });

      setMessage(data.message || "Notice created successfully");

      form.reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Failed to add notice"
        );
      } else {
        setMessage("Failed to add notice");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Add Notice
          </span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a notice for everyone to see
        </p>
      </div>

      <form onSubmit={addNotice}>
        <FieldGroup className="grid gap-4">
          {/* Title */}
          <Field>
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter notice title"
              minLength={2}
              required
            />
          </Field>

          {/* Content */}
          <Field>
            <Label htmlFor="content">Content</Label>

            <textarea
              id="content"
              name="content"
              placeholder="Write the notice content"
              rows={5}
              required
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </Field>
        </FieldGroup>

        {message && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm">
            {message}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Notice"}
        </Button>
      </form>
    </div>
  );
}

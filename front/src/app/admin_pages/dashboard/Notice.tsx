"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios/axios";
import {
  noticeSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/validations/admin";

export default function Notice() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const addNotice = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = noticeSchema.safeParse({
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
    });

    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.post("/admin/notices", result.data);

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
    <div className="flex flex-1 flex-col">
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

      <form
        onSubmit={addNotice}
        className="flex flex-1 flex-col"
        noValidate
      >
        <FieldGroup className="admin-form grid gap-4">
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
              aria-invalid={!!errors.title}
            />

            <FieldError>{errors.title}</FieldError>
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
              aria-invalid={!!errors.content}
              className="w-full max-h-[200px] rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
            />

            <FieldError>{errors.content}</FieldError>
          </Field>
        </FieldGroup>

        <div className="mt-auto space-y-4 pt-4">
          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-base font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Notice"}
          </Button>
        </div>
      </form>
    </div>
  );
}

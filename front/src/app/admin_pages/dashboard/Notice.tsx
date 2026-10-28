"use client";

import { Button } from "@/components/ui/button";

export default function Notice() {
    return (
        <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
            <h2 className="text-lg font-semibold">📢 Notices</h2>

            <div className="mt-2 flex flex-wrap gap-2">
                <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                    Add Notice
                </Button>
                <button className="rounded-md border px-3 py-1.5 text-sm">
                    Notice List
                </button>
            </div>
        </div>
    );
}

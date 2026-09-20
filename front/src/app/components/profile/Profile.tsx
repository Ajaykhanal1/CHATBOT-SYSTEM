"use client";
import { useRouter } from "next/navigation";

export default function Profile() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold">
                        A
                    </div>

                    <h1 className="text-2xl font-bold">Ajay Khanal</h1>
                    <p className="text-gray-500">ajay@example.com</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
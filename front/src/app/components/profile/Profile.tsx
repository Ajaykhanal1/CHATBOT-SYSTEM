"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);



    const handleLogout = () => {
        logout();
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

                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-gray-500">{user?.email}</p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger className="cursor-pointer w-full rounded-lg bg-gray-600 px-4 py-3 font-medium text-white">
                        Log out
                    </AlertDialogTrigger>

                    <AlertDialogContent className="-translate-y-35 h-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>

                            <AlertDialogDescription>
                                You will need to sign in again to access your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter >
                            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

                            <AlertDialogAction className="cursor-pointer" onClick={handleLogout}>
                                Log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
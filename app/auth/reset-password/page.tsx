"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

function ResetPasswordSubtitle() {
    const email = useSearchParams().get("email");
    if (!email) return <span>Almost done. Choose your new password.</span>;
    return (
        <span>
            Almost done. Choose your new password for <b>{email}</b>
        </span>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <Suspense fallback={null}>
                <AuthHeader
                    hasImageBorder={true}
                    imageSrc="/images/icons/key.svg"
                    title="Reset your password"
                    subtitle={<ResetPasswordSubtitle />}
                />
                <ResetPasswordForm />
            </Suspense>
            <AuthFooter label="Remember your password?" linkLabel="Log in" href="/auth/login" />
        </div>
    );
}

"use client";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <AuthHeader
                hasImageBorder={true}
                imageSrc="/images/icons/key.svg"
                title="Reset your password"
                subtitle={
                    <span>
                        Almost done. Choose your new password for <b>cjaymoni@perspectiv.com</b>
                    </span>
                }
            />
            <ResetPasswordForm />
            <AuthFooter label="Remember your password?" linkLabel="Log in" href="/auth/login" />
        </div>
    );
}

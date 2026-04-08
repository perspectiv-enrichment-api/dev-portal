"use client";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordChangedForm } from "@/components/auth/password-changed-form";

export default function PasswordChangedPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <AuthHeader
                hasImageBorder={true}
                imageSrc="/images/icons/check.svg"
                title="Password changed!"
                subtitle="Your password has been reset. You can log in using your new password."
            />
            <PasswordChangedForm />
        </div>
    );
}

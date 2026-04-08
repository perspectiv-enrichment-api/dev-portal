"use client";

import { useState } from "react";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { EmailSentForm } from "@/components/auth/email-sent-form";

export default function EmailSentPage() {
    const [resendMail, setResendMail] = useState(false);
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <AuthHeader
                hasImageBorder={true}
                imageSrc="/images/icons/mail.svg"
                title="Email on the way!"
                subtitle="We’ve sent you password reset instructions. Check your spam if it doesn’t show up soon"
            />
            <EmailSentForm resendMail={resendMail} />
            <AuthFooter label="Didn’t receive the email?" linkLabel="Resend" href="#" clickHandler={() => setResendMail(true)} />
        </div>
    );
}

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <AuthHeader
                hasImageBorder={true}
                imageSrc="/images/icons/lock.svg"
                title="Forgot Password"
                subtitle="Hang tight, we’ll send reset instructions to your email address."
            />
            <ForgotPasswordForm />
            <AuthFooter label="Remember your password?" linkLabel="Log in" href="/auth/login" />
        </div>
    );
}

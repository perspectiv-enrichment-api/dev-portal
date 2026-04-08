import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-8">
            <AuthHeader imageSrc="/images/logos/logo.svg" title="Log in to your account" subtitle="Welcome back! Please enter your details." />
            <LoginForm />
            <AuthFooter label="Don't have an account?" linkLabel="Sign up" href="/auth/register" />
        </div>
    );
}

"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

import { AuthFooter } from "./auth-footer";
import { AuthHeader } from "./auth-header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SocialButton } from "../ui/social-button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { countriesOptions } from "@/lib/countries";
import { ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { authApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { useAuth } from "@/lib/auth-context";

const steps = [
  {
    label: "Your details",
    description: "Please provide your personal details",
  },
  { label: "Company details", description: "Tell us about your company" },
  { label: "Choose password", description: "Choose a secured password" },
  {
    label: "Verify email",
    description: "Please verify the email you submitted",
  },
];

// ── Shared form state ────────────────────────────────────────────────────────
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  companyName: string;
  websiteUrl: string;
  companySize: string;
  password: string;
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function StepPersonal({
  onNext,
  data,
  setData,
}: {
  onNext: () => void;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const country = data.country || "GH";
  const selectedCountry = countriesOptions.find(
    (c) => String(c.id) === country,
  );
  const CountryIcon = selectedCountry?.icon;

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Create an account"
        subtitle="Get started with Perspectiv in just a few steps"
        imageSrc="/images/logos/logo.svg"
      />

      <SocialButton
        social="google"
        size="lg"
        className="w-full bg-white h-9 text-sm"
        onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/oauth/google`; }}
      >
        Continue with Google
      </SocialButton>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">First name</label>
            <Input
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Last name</label>
            <Input
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Country</label>
            <Select value={country} onValueChange={(v) => setData((d) => ({ ...d, country: v }))}>
              <SelectTrigger className="w-full">
                <span className="flex items-center gap-2">
                  {CountryIcon &&
                    (() => {
                      const Icon = CountryIcon as React.FC<
                        React.HTMLAttributes<HTMLElement>
                      >;
                      return (
                        <span
                          className="w-[34px] h-[24px] shrink-0 overflow-hidden"
                          style={{ borderRadius: 4 }}
                        >
                          <Icon
                            className="w-full h-full object-cover"
                            style={{ borderRadius: 0 }}
                          />
                        </span>
                      );
                    })()}
                  <span>{selectedCountry?.label}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                {countriesOptions.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={String(item.id)}
                    icon={item.icon}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Next
        </Button>
      </form>

      <AuthFooter
        label="Have an account?"
        linkLabel="Log in"
        href="/auth/login"
      />
    </div>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
function StepCompany({
  onNext,
  onBack,
  data,
  setData,
}: {
  onNext: () => void;
  onBack: () => void;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Company details"
        subtitle="Tell us about your company"
        imageSrc="/images/logos/logo.svg"
      />
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Company name</label>
            <Input
              placeholder="Enter your company name"
              value={data.companyName}
              onChange={(e) => setData((d) => ({ ...d, companyName: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Website URL</label>
            <Input
              type="url"
              placeholder="Enter website link"
              value={data.websiteUrl}
              onChange={(e) => setData((d) => ({ ...d, websiteUrl: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Company size</label>
            <Select value={data.companySize} onValueChange={(v) => setData((d) => ({ ...d, companySize: v }))}>
              <SelectTrigger className="w-full">
                <span>{data.companySize ? `${data.companySize} employees` : "Select company size"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="500+">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 flex-col">
          <Button
            type="submit"
            variant="default"
            size="default"
            className="w-full"
          >
            Next
          </Button>
          <Button
            iconLeading={<ArrowLeft />}
            type="button"
            variant="link"
            size="default"
            className="w-full"
            onClick={onBack}
          >
            Go back
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
function StepPassword({
  onNext,
  onBack,
  data,
  setData,
}: {
  onNext: () => void;
  onBack: () => void;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const password = data.password;
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    hasMinLength &&
    hasSpecialChar &&
    password === confirm &&
    confirm.length > 0;

  const rules = [
    { met: hasMinLength, label: "Must be at least 8 characters" },
    { met: hasSpecialChar, label: "Must contain one special character" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await authApi.register({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        country: data.country,
        company_name: data.companyName,
        website_url: data.websiteUrl || undefined,
        company_size: data.companySize,
        password,
      });
      onNext();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Choose a password"
        subtitle="Choose a secured password"
        imageSrc="/images/logos/logo.svg"
      />
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Enter password</label>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Confirm password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {mismatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {rules.map(({ met, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex size-4 items-center justify-center rounded-full border ${met ? "border-[#A3A3A3] bgwhite]" : "border-gray-300"}`}
              >
                {met && (
                  <svg
                    className="size-2.5 text-[#A3A3A3]"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`text-sm ${met ? "text-neutral-700" : "text-muted-foreground"}`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 flex-col">
          <Button
            type="submit"
            variant="default"
            size="default"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Next"}
          </Button>
          <Button
            iconLeading={<ArrowLeft />}
            type="button"
            variant="link"
            size="default"
            className="w-full"
            onClick={onBack}
          >
            Go back
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Step 4 ────────────────────────────────────────────────────────────────────
function StepVerify({ onBack, email }: { onBack: () => void; email: string }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 4) return;
    setError("");
    setLoading(true);
    try {
      const { user, tokens } = await authApi.verifyEmail({ email, code: otp });
      authStore.save(tokens, user);
      setUser(user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp({ email });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Enter verification code"
        subtitle={
          <span>
            Please enter the verification code sent to <br />
            <b>{email}</b>
          </span>
        }
        imageSrc="/images/logos/logo.svg"
      />
      <InputOTP
        maxLength={4}
        value={otp}
        onChange={setOtp}
        containerClassName="justify-center gap-3"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <InputOTPGroup key={i}>
            <InputOTPSlot
              index={i}
              className="h-16 w-16 text-base rounded-md border"
            />
          </InputOTPGroup>
        ))}
      </InputOTP>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <div className="flex gap-3 flex-col">
        <Button
          type="button"
          variant="default"
          size="default"
          className="w-full"
          disabled={loading || otp.length < 4}
          onClick={handleVerify}
        >
          {loading ? "Verifying…" : "Verify"}
        </Button>
        <Button
          type="button"
          variant="link"
          size="default"
          className="w-full"
          onClick={handleResend}
        >
          Resend code
        </Button>
        <Button
          iconLeading={<ArrowLeft />}
          type="button"
          variant="link"
          size="default"
          className="w-full"
          onClick={onBack}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}

// ── Orchestrator ──────────────────────────────────────────────────────────────
export const RegisterForm = ({
  step,
  onStepChange,
}: {
  step: number;
  onStepChange: (step: number) => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "GH",
    companyName: "",
    websiteUrl: "",
    companySize: "",
    password: "",
  });
  const next = () => onStepChange(step + 1);
  const back = () => onStepChange(step - 1);

  return (
    <>
      {step === 0 && <StepPersonal onNext={next} data={formData} setData={setFormData} />}
      {step === 1 && <StepCompany onNext={next} onBack={back} data={formData} setData={setFormData} />}
      {step === 2 && <StepPassword onNext={next} onBack={back} data={formData} setData={setFormData} />}
      {step === 3 && <StepVerify onBack={back} email={formData.email} />}
    </>
  );
};

// ── Stepper UI ────────────────────────────────────────────────────────────────
export const RegisterStepper = ({
  currentStep = 0,
  onStepClick,
}: {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}) => (
  <div className="w-full px-[10%] sm:px-[14%]">
    <div className="grid grid-cols-4">
      {steps.map((step, i) => {
        const isCurrent = i === currentStep;
        const isVisited = i < currentStep;
        const barColor = isCurrent
          ? "bg-black"
          : isVisited
            ? "bg-[#0284C7]"
            : "bg-[#E5E5E5]";
        const textColor = isCurrent
          ? "text-black"
          : isVisited
            ? "text-[#0284C7]"
            : "text-[#525252]";
        return (
          <button
            key={step.label}
            type="button"
            onClick={() => (isCurrent || isVisited) && onStepClick?.(i)}
            className={`flex flex-col gap-2 py-4 pr-4 text-left ${
              isCurrent || isVisited
                ? "cursor-pointer"
                : "cursor-default pointer-events-none"
            }`}
          >
            <div className={`h-1 w-full ${barColor}`} />
            <div className="flex flex-col gap-0.5">
              <p className={`text-sm font-semibold ${textColor}`}>
                {step.label}
              </p>
              <p className={`text-sm ${textColor}`}>{step.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

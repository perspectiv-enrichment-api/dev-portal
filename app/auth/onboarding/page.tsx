"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { countriesOptions } from "@/lib/countries";
import { authApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

export default function OnboardingPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("GH");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry = countriesOptions.find((c) => String(c.id) === country);
  const CountryIcon = selectedCountry?.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await authStore.token();
      const res = await authApi.onboarding(token, {
        first_name: firstName,
        last_name: lastName,
        country,
        company_name: companyName,
        website_url: websiteUrl || undefined,
        company_size: companySize,
      });
      // Update stored user with org_id
      const currentUser = authStore.getUser();
      if (currentUser) {
        authStore.save(
          { accessToken: await authStore.token(), refreshToken: localStorage.getItem("pv_refresh")! },
          { ...currentUser, org_id: res.data.org.id }
        );
      }
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <AuthHeader
        title="Complete your profile"
        subtitle="Tell us a bit more so we can set up your workspace"
        imageSrc="/images/logos/logo.svg"
      />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">First name</label>
            <Input placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Last name</label>
            <Input placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Country</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full">
                <span className="flex items-center gap-2">
                  {CountryIcon && (() => {
                    const Icon = CountryIcon as React.FC<React.HTMLAttributes<HTMLElement>>;
                    return (
                      <span className="w-[34px] h-[24px] shrink-0 overflow-hidden" style={{ borderRadius: 4 }}>
                        <Icon className="w-full h-full object-cover" style={{ borderRadius: 0 }} />
                      </span>
                    );
                  })()}
                  <span>{selectedCountry?.label}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                {countriesOptions.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)} icon={item.icon}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Company name</label>
            <Input placeholder="Enter your company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Website URL</label>
            <Input type="url" placeholder="Enter website link" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Company size</label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger className="w-full">
                <span>{companySize ? `${companySize} employees` : "Select company size"}</span>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" variant="default" size="default" className="w-full" disabled={loading || !companySize}>
          {loading ? "Setting up…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}

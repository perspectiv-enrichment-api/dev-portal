"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MerchantForm } from "@/components/admin/merchant-form";
import { merchantsApi, type MerchantDetail } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

export default function EditMerchantPage() {
  const { id } = useParams<{ id: string }>();
  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    authStore
      .token()
      .then((token) => merchantsApi.get(token, id))
      .then(setMerchant)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load merchant"),
      );
  }, [id]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  return <MerchantForm initial={merchant} />;
}

"use client";

import { useState } from "react";
import { RegisterForm, RegisterStepper } from "@/components/auth/register-form";

export default function RegisterPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="relative w-full flex-1 overflow-hidden">
      <div className="flex w-full justify-center pb-32">
        <div className="w-full max-w-sm">
          <RegisterForm step={step} onStepChange={setStep} />
        </div>
      </div>
      <div className="fixed bottom-[5%] w-full">
        <RegisterStepper currentStep={step} onStepClick={setStep} />
      </div>
    </div>
  );
}

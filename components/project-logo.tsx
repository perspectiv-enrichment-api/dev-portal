import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectLogoProps {
  name?: string;
  logo?: string;
  size?: "sm" | "md";
  className?: string;
}

export function ProjectLogo({ name, logo, size = "md", className }: ProjectLogoProps) {
  const dim = size === "sm" ? 36 : 48;

  if (name) {
    return (
      <div
        className={cn(
          "rounded-full border border-neutral-200 bg-white overflow-hidden flex items-center justify-center shrink-0",
          className
        )}
        style={{ width: dim, height: dim }}
      >
        {logo ? (
          <Image src={logo} alt={name} width={dim} height={dim} className="object-contain" unoptimized />
        ) : (
          <span className="text-xs font-semibold text-neutral-600">{name[0]}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      src="/images/logos/logo-with-text.svg"
      alt="Perspectiv"
      width={150}
      height={32}
      className={className}
    />
  );
}

import Image from "next/image";

export function ProjectLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Perspectiv"
      width={32}
      height={32}
      className={className}
    />
  );
}

import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
    title: string;
    subtitle: React.ReactNode;
    hasImageBorder?: boolean;
    imageSrc?: string;
}

export const AuthHeader = ({ title, subtitle, hasImageBorder, imageSrc }: AuthHeaderProps) => {
    return (
        <div className="flex flex-col items-center gap-4">
            {hasImageBorder && imageSrc ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200">
                    <Image src={imageSrc} alt="Perspectiv Logo" width={28} height={28} />
                </div>
            ) : (
                imageSrc && <Image src={imageSrc} alt="Perspectiv Logo" width={48} height={36} />
            )}
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-primary">{title}</h1>
                <p className="text-sm text-tertiary">{subtitle}</p>
            </div>
        </div>
    );
};

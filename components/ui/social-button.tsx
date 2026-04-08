"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import { cn } from "@/lib/utils";
import {
  AppleLogo,
  DribbleLogo,
  FacebookLogo,
  FigmaLogo,
  FigmaLogoOutlined,
  GoogleLogo,
  TwitterLogo,
} from "@/components/ui/social-logos";

export const styles = {
  common: {
    root: "group relative inline-flex h-max cursor-pointer items-center justify-center font-semibold whitespace-nowrap transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    icon: "pointer-events-none shrink-0",
  },

  sizes: {
    md: {
      root: "gap-2 rounded-lg px-3.5 py-2.5 text-sm before:rounded-[7px] data-[icon-only=true]:p-3",
      icon: "size-4",
    },
    lg: {
      root: "gap-2.5 rounded-lg px-4 py-2.5 text-base before:rounded-[7px] data-[icon-only=true]:p-3",
      icon: "size-5",
    },
  },

  colors: {
    gray: {
      root: "bg-secondary text-secondary-foreground shadow-xs ring-1 ring-border ring-inset hover:bg-secondary/80",
      icon: "text-muted-foreground group-hover:text-foreground",
    },
    black: {
      root: "bg-black text-white shadow-xs ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0%",
      icon: "",
    },
    facebook: {
      root: "bg-[#1877F2] text-white shadow-xs ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0% hover:bg-[#0C63D4]",
      icon: "",
    },
    dribble: {
      root: "bg-[#EA4C89] text-white shadow-xs ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0% hover:bg-[#E62872]",
      icon: "",
    },
  },
};

interface CommonProps {
  social: "google" | "facebook" | "apple" | "twitter" | "figma" | "dribble";
  disabled?: boolean;
  theme?: "brand" | "color" | "gray";
  size?: keyof typeof styles.sizes;
}

interface ButtonProps
  extends
    CommonProps,
    DetailedHTMLProps<
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
      HTMLButtonElement
    > {}

interface LinkProps
  extends
    CommonProps,
    DetailedHTMLProps<
      Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color">,
      HTMLAnchorElement
    > {}

export type SocialButtonProps = ButtonProps | LinkProps;

export const SocialButton = ({
  size = "lg",
  theme = "brand",
  social,
  className,
  children,
  disabled,
  ...otherProps
}: SocialButtonProps) => {
  const href = "href" in otherProps ? otherProps.href : undefined;
  const Component = href ? "a" : "button";

  const isIconOnly = !children;

  const socialToColor = {
    google: "gray",
    facebook: "facebook",
    apple: "black",
    twitter: "black",
    figma: "black",
    dribble: "dribble",
  } as const;

  const colorStyles =
    theme === "brand"
      ? styles.colors[socialToColor[social]]
      : styles.colors.gray;

  const logos = {
    google: GoogleLogo,
    facebook: FacebookLogo,
    apple: AppleLogo,
    twitter: TwitterLogo,
    figma: theme === "gray" ? FigmaLogoOutlined : FigmaLogo,
    dribble: DribbleLogo,
  };

  const Logo = logos[social];

  const sharedProps = href
    ? {
        href: disabled ? undefined : href,
        "aria-disabled": disabled || undefined,
      }
    : {
        type:
          (otherProps as ButtonHTMLAttributes<HTMLButtonElement>).type ||
          "button",
        disabled,
      };

  return (
    <Component
      {...(otherProps as object)}
      {...sharedProps}
      data-icon-only={isIconOnly ? true : undefined}
      className={cn(
        styles.common.root,
        styles.sizes[size].root,
        colorStyles.root,
        className,
      )}
    >
      <Logo
        className={cn(
          styles.common.icon,
          styles.sizes[size].icon,
          theme === "gray"
            ? colorStyles.icon
            : theme === "brand" &&
                (social === "facebook" ||
                  social === "apple" ||
                  social === "twitter")
              ? "text-white"
              : theme === "color" &&
                  (social === "apple" || social === "twitter")
                ? "text-black"
                : "",
        )}
        colorful={
          (theme === "brand" && (social === "google" || social === "figma")) ||
          (theme === "color" &&
            (social === "google" ||
              social === "facebook" ||
              social === "figma" ||
              social === "dribble")) ||
          undefined
        }
      />

      {children}
    </Component>
  );
};

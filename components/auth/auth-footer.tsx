import { Button } from "../ui/button";

interface AuthFooterProps {
  label: string;
  linkLabel: string;
  href: string;
  clickHandler?: () => void;
}

export const AuthFooter = ({
  label,
  linkLabel,
  href,
  clickHandler,
}: AuthFooterProps) => {
  return (
    <p className="text-center text-sm text-tertiary">
      {label}
      <Button
        href={href}
        variant={"link"}
        color="link-gray"
        size="sm"
        onClick={clickHandler}
      >
        {linkLabel}
      </Button>
    </p>
  );
};

import { ProjectLogo } from "../project-logo";
import { Button } from "../ui/button";

export const Navbar = () => {
  return (
    <header className="flex h-16 items-center border-b border-secondary">
      <div className="w-full px-[6%] sm:px-[14%] flex items-center justify-between">
        {/* Logo + centered nav (grouped together on desktop) */}
        <div className="flex items-center gap-4">
          <ProjectLogo />
          <nav className="hidden sm:flex items-center">
            <Button href="#" variant="link" size="default">
              API Documentation
            </Button>
          </nav>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            href="/auth/login"
            variant="outline"
            size="sm"
            className="bg-white"
          >
            Log in
          </Button>
          <Button href="/auth/register" variant="default" size="sm">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
};

'use client'
import { usePathname } from "next/navigation";
import { isHomePage } from "./utils";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  const pathname = usePathname();
  const shouldShowBackground = isHomePage(pathname);

  return (
    <div className={`relative min-h-dvh w-full overflow-x-hidden ${shouldShowBackground ? "bg-white" : ""}`}>
      <div className="relative min-h-dvh flex flex-col w-full">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;

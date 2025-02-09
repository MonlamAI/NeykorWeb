 'use client'
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import bgimage from "../public/bggradient.png";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  const pathname = usePathname();
  
  const shouldShowBackground = pathname === '/en' || pathname === '/bod';

  return (
    <div className={`relative min-h-screen  ${shouldShowBackground && "bg-white"}  w-full`}>
      {shouldShowBackground && (
        <div
          className="fixed top-0 left-0 right-0 w-full pointer-events-none"
          style={{
            height: '45vh',
            backgroundImage: `url(${bgimage.src})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />
      )}
      <div className={`relative z-10 min-h-screen `}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
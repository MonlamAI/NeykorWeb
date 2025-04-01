'use client'
import { usePathname } from "next/navigation";
import bgimage from "../../public/header.jpg";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  const pathname = usePathname();
  const shouldShowBackground = pathname === '/en' || pathname === '/bod';

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${shouldShowBackground ? "bg-white" : ""}`}>
      {shouldShowBackground && (
        <div
          className="fixed top-0 left-0 right-0 w-full pointer-events-none"
          style={{
            height: '40vh',
            backgroundImage: `url(${bgimage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />
      )}
      <div className="relative z-10 min-h-screen flex flex-col w-full">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
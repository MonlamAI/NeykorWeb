'use client'
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const MobileNav = ({ setIsOpen }:any) => {
  const t = useTranslations("navbar");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const checkcolor = pathname === '/en' || pathname === '/bod';

  const navlinks = [
    { key: "stas", href: "/Statue" },
    { key: "mons", href: "/Monastary" },
    { key: "fes", href: "/Festival" },
    { key: "sacred", href: "/Sacred" },
    { key: "cont", href: "/Contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div 
        className="fixed inset-0 "
        onClick={() => setIsOpen(false)}
      />
      
      <div className="fixed inset-y-0 right-0 w-3/4 bg-white/10 dark:bg-black/10 backdrop-blur border-l border-white/20 dark:border-gray-800/20 shadow-2xl">        
      <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 dark:hover:bg-gray-800/30 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col space-y-4">
              {navlinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${activeLocale}${link.href}`}
                  onClick={handleLinkClick}
                  className={`px-4 py-2 text-lg rounded-md transition-colors
                    ${activeLocale === 'bod' ? 'font-monlamuchen' : ''}
                    ${
                        checkcolor 
                          ? 'hover:bg-white/20 dark:hover:bg-gray-800/30' 
                          : 'hover:bg-gray-800/20 dark:hover:bg-white/20'
                      }
                    ${pathname.includes(link.href) ? 
                      (checkcolor ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-700 dark:bg-gray-200') : ''
                    }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
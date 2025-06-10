"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
  labels?: {
    home: string;
  };
}

const Breadcrumb = ({
  items,
  locale,
  labels = { home: "Home" },
}: BreadcrumbProps) => {
  const isLocaleBody = locale === "bod";

  return (
    <div className="sticky mt-2 top-0 bg-white dark:bg-neutral-950 z-10 ">
      <div className="max-w-6xl mx-auto p-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-200">
          <Link
            href={`/${locale}`}
            className="flex items-center hover:text-gray-900 dark:hover:text-gray-400"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className={isLocaleBody ? "font-monlamuchen" : ""}>
              {labels.home}
            </span>
          </Link>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link
                  href={`/${locale}${item.href}`}
                  className="hover:text-gray-900 dark:hover:text-gray-400 flex items-center"
                >
                  <span className={isLocaleBody ? "font-monlamuchen" : ""}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={`text-gray-900 dark:text-gray-400 ${isLocaleBody ? "font-monlamuchen" : ""
                    } ${isLast ? "truncate w-[80px] overflow-hidden whitespace-nowrap text-ellipsis inline-block align-middle md:overflow-visible md:whitespace-normal md:text-clip md:w-auto md:truncate-none" : ""}`}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          }
          )}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

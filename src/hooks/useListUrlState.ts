"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

const Q_KEY = "q";
const PAGE_KEY = "page";

function parsePage(value: string | null): number {
  if (!value) return 1;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function useListUrlState() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const q = searchParams.get(Q_KEY) ?? "";
  const page = parsePage(searchParams.get(PAGE_KEY));

  const replaceQuery = useCallback(
    (next: { q?: string; page?: number }) => {
      const query: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        if (key !== Q_KEY && key !== PAGE_KEY) {
          query[key] = value;
        }
      });

      const nextQ = next.q !== undefined ? next.q : q;
      const nextPage = next.page !== undefined ? next.page : page;

      if (nextQ.trim()) query[Q_KEY] = nextQ;
      if (nextPage > 1) query[PAGE_KEY] = String(nextPage);

      router.replace(
        Object.keys(query).length ? { pathname, query } : pathname,
        { scroll: false }
      );
    },
    [searchParams, q, page, pathname, router]
  );

  const setQ = useCallback(
    (value: string) => {
      replaceQuery({ q: value, page: 1 });
    },
    [replaceQuery]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      if (nextPage < 1) return;
      replaceQuery({ page: nextPage });
    },
    [replaceQuery]
  );

  const clearQ = useCallback(() => {
    replaceQuery({ q: "", page: 1 });
  }, [replaceQuery]);

  const clampPage = useCallback(
    (totalPages: number) => {
      if (totalPages < 1) return;
      if (page > totalPages) {
        replaceQuery({ page: totalPages });
      }
    },
    [page, replaceQuery]
  );

  return useMemo(
    () => ({ q, page, setQ, setPage, clearQ, clampPage }),
    [q, page, setQ, setPage, clearQ, clampPage]
  );
}

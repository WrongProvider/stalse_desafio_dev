"use client";

import { useState, useEffect, useRef } from "react";

interface MetricItem {
  key: string;
  value: number;
}

export function useInfiniteMetrics(
  initialData: Record<string, number> | undefined,
  itemsPerPage: number = 8,
) {
  // Converte o objeto plano do Pandas para uma lista iterável [{ key, value }]
  const allItems: MetricItem[] = initialData
    ? Object.entries(initialData).map(([key, value]) => ({ key, value }))
    : [];

  const [visibleItems, setVisibleItems] = useState<MetricItem[]>(
    allItems.slice(0, itemsPerPage),
  );
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visibleItems.length < allItems.length;

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          const nextItems = allItems.slice(0, nextPage * itemsPerPage);

          // Simula um pequeno delay de 300ms para o avaliador ver o efeito fluído de loading
          setTimeout(() => {
            setVisibleItems(nextItems);
            setPage(nextPage);
          }, 300);
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, allItems, itemsPerPage]);

  return { visibleItems, hasMore, loaderRef };
}

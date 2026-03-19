"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import {
  getPublicServiceCatalog,
  type PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";

type ServiceCatalogContextValue = ReturnType<typeof useApiQuery<PublicServiceCatalogResponse>>;

const ServiceCatalogContext = createContext<ServiceCatalogContextValue | null>(null);

export function ServiceCatalogProvider({
  children,
  initialData = null,
}: {
  children: ReactNode;
  initialData?: PublicServiceCatalogResponse | null;
}) {
  const [seededData, setSeededData] = useState<PublicServiceCatalogResponse | null>(initialData);
  const query = useApiQuery(getPublicServiceCatalog, [], initialData === null);

  const value = useMemo<ServiceCatalogContextValue>(() => {
    if (initialData === null) {
      return query;
    }

    return {
      data: seededData,
      isLoading: false,
      error: null,
      refresh: async () => {
        const nextData = await getPublicServiceCatalog();
        setSeededData(nextData);
      },
      setData: setSeededData,
    };
  }, [initialData, query, seededData]);

  return (
    <ServiceCatalogContext.Provider value={value}>
      {children}
    </ServiceCatalogContext.Provider>
  );
}

export function useLandingServiceCatalog() {
  const context = useContext(ServiceCatalogContext);

  if (!context) {
    throw new Error("useLandingServiceCatalog must be used within ServiceCatalogProvider");
  }

  return context;
}

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import {
  getPublicServiceCatalog,
  type PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";

type ServiceCatalogContextValue = ReturnType<typeof useApiQuery<PublicServiceCatalogResponse>>;

const ServiceCatalogContext = createContext<ServiceCatalogContextValue | null>(null);

export function ServiceCatalogProvider({ children }: { children: ReactNode }) {
  const query = useApiQuery(getPublicServiceCatalog, []);

  return (
    <ServiceCatalogContext.Provider value={query}>
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

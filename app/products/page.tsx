"use client";

import AllProductsList from "@/components/products/AllProductsList";
import ProductsLeftFilter from "@/components/products/ProductsLeftFilter";

export default function ProductsPage() {
  return (
    <section className="pb-14 pt-[7.5rem] bg-neutral-100 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-start gap-10 lg:grid-cols-[300px_1fr]">
          <ProductsLeftFilter />
          <AllProductsList />
        </div>
      </div>
    </section>
  );
}

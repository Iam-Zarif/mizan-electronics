"use client";

import { useState } from "react";

import { notFound } from "next/navigation";
import ProductDetailPhoto from "@/components/products/productDetail/hero/ProductDetailPhoto";
import ProductShortDetails from "@/components/products/productDetail/hero/ProductShortDetails";
import Tablist from "@/components/products/productDetail/tab/Tablist";
import Description from "@/components/products/productDetail/tab/Description";
import Reviews from "@/components/products/productDetail/tab/Reviews";
import QA from "@/components/products/productDetail/tab/QA";
import SimilarProducts from "@/components/products/SimilarProducts";
import { catalogProducts } from "@/lib/products";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const baseProduct = catalogProducts.find(
    (p) => slugify(p.name) === params.slug,
  );

  if (!baseProduct) return notFound();

  const product = {
    ...baseProduct,
    images: [baseProduct.image],
    description:
      "High performance inverter AC designed for Bangladeshi climate with fast cooling, low voltage operation and long-lasting compressor.",
  };

  const [tab, setTab] = useState<"desc" | "reviews" | "qa">("desc");

  return (
    <section className="pt-[8.5rem] pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <ProductDetailPhoto product={product} />

          <ProductShortDetails product={product} />
        </div>

        <div className="mt-20 mx-auto">
          <Tablist setTab={setTab} tab={tab}/>
          <div className="mt-10 text-neutral-600 leading-relaxed mx-auto max-w-4xl">
            {tab === "desc" && (
              <Description/>
            )}

            {tab === "reviews" && (
              <Reviews/>
            )}

            {tab === "qa" && (
             <QA/>
            )}
          </div>
        </div>
        <SimilarProducts />
      </div>
    </section>
  );
}

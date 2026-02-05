import { motion } from "motion/react";
import { ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { catalogProducts, type CatalogProduct } from "@/lib/products";

const SortDropdown = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) => (
  <div className="relative cursor-pointer">
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="appearance-none rounded-full border cursor-pointer  border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-5 py-2 pr-10 text-sm shadow"
    >
      <option>Popular</option>
      <option>Price Low</option>
      <option>Price High</option>
      <option>Rating</option>
    </select>
    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
  </div>
);

const ProductCard = ({ product }: { product: CatalogProduct }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.35)]"
  >
    <div className="relative h-44 w-full">
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="object-cover"
      />
    </div>

    <div className="p-5">
      <h3 className="text-sm font-semibold line-clamp-2">
        {product.name}
      </h3>
      <p className="text-xs text-neutral-500">{product.brand}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-600">
          ৳ {product.price.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-xs text-amber-500">
          <Star size={14} className="fill-amber-500" />
          {product.rating}
        </span>
      </div>
    </div>
  </motion.div>
);


const ITEMS_PER_PAGE = 12;
const AllProductsList = () => {
  const [sort, setSort] = useState("Popular");
  const [page, setPage] = useState(1);

  const sortedProducts = useMemo(() => {
    const data = [...catalogProducts];
    if (sort === "Price Low") data.sort((a, b) => a.price - b.price);
    if (sort === "Price High") data.sort((a, b) => b.price - a.price);
    if (sort === "Rating") data.sort((a, b) => b.rating - a.rating);
    return data;
  }, [sort]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const visible = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-extrabold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Air Conditioners
        </h2>
        <SortDropdown value={sort} setValue={setSort} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`h-10 cursor-pointer w-10 rounded-full text-sm font-semibold ${
              page === i + 1
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 shadow"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllProductsList;

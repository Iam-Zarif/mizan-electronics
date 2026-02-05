import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

type Product = {
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  description: string;
};

const ProductDetailPhoto = ({ product }: { product: Product }) => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex flex-row gap-3 sm:flex-col">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={`relative h-20 w-20 cursor-pointer  rounded-xl p-0.5 transition
                             ${
                               activeImg === i
                                 ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
                                 : "opacity-70 hover:opacity-100"
                             }`}
          >
            <div className="relative h-full w-full rounded-[10px] bg-white overflow-hidden">
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </div>
          </button>
        ))}
      </div>

      <motion.div
        key={activeImg}
        initial={{ opacity: 0.6, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative min-h-[18rem] flex-1 rounded-3xl bg-white shadow-xl sm:min-h-[26rem]"
      >
        <Image
          src={product.images[activeImg]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-contain p-8"
        />
      </motion.div>
    </div>
  );
};

export default ProductDetailPhoto;

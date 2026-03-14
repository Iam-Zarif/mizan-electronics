import { Star, Zap, ShieldCheck, Plus, Minus, Truck } from "lucide-react";
import { useState } from "react";

type Product = {
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  description: string;
};

const ProductShortDetails = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice ? product.originalPrice - product.price : null;
    
  return (
     <div className="space-y-5">
            <h1 className="text-3xl lg:text-4xl font-extrabold">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="h-5 w-5 fill-yellow-500" />
              <span className="font-semibold text-neutral-700">
                {product.rating} / 5
              </span>
            </div>

            <p className="text-neutral-600">{product.description}</p>

            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-indigo-600">
                ৳ {product.price.toLocaleString()}
              </span>
              {discount !== null && (
                <>
                  <span className="text-sm line-through text-neutral-400">
                    ৳ {product.originalPrice?.toLocaleString() ?? ""}
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    {product.originalPrice ? `Save ৳ ${discount.toLocaleString()}` : ""}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-sm">Quantity</span>
              <div className="flex items-center border rounded-full">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-1 bg-white rounded-l-xl     cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 rounded-r-xl  bg-white cursor-pointer py-1">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 text-sm space-y-1">
              <p className="font-semibold flex items-center gap-2">
                <Truck size={16} /> Cash on Delivery
              </p>
              <p>✔ Available inside Dhaka city</p>
              <p>✔ Product inspection allowed</p>
              <p className="text-xs text-neutral-500">
                Installation charge not included. Delivery time 1–3 working
                days.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <Zap size={16} className="text-indigo-500" />
                Inverter
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={16} className="text-indigo-500" />
                Official Warranty
              </span>
            </div>

            <button
              className="w-full flex justify-center group items-center gap-2
                    rounded-full px-8 py-3
                    bg-indigo-600 text-white text-sm font-semibold
                    shadow-[0_0_40px_rgba(99,102,241,0.45)]
                    transition-all duration-300
                    hover:bg-indigo-500  cursor-pointer  hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
            >
              Add to Cart
            </button>
          </div>
  )
}

export default ProductShortDetails

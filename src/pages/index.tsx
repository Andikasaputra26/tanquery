import { Product } from "../utils/interface/Product";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [fetchData, setFetchData] = useState(false);
  const [showProduct, setShowProduct] = useState<string | null>(null);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: fetchData,
  });

  const {
    data: detailProduct,
    isError: isErrorDetail,
    isLoading: isLoadingDetail,
  } = useQuery<Product>({
    queryKey: ["product", showProduct],
    queryFn: async () => {
      const res = await fetch(
        `https://fakestoreapi.com/products/${showProduct}`
      );
      if (!res.ok) throw new Error("Failed to fetch product detail");
      return res.json();
    },
    enabled: !!showProduct,
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load products.</p>;
  }

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {!fetchData && (
        <button
          onClick={() => setFetchData(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
        >
          Fetch Products
        </button>
      )}
      {products?.map((product) => (
        <div
          key={product.id}
          className="shadow-lg p-4 flex flex-col items-center rounded-lg border cursor-pointer"
          onClick={() => setShowProduct(product.id)}
        >
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={150}
            className="object-contain h-40 w-auto"
          />
          <h4 className="relative w-full font-bold text-lg hover:text-red-500 group text-center mt-2">
            {product.title}
            <span className="absolute left-1/2 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full transform -translate-x-1/2"></span>
          </h4>
          <p className="text-lg font-bold text-blue-600">${product.price}</p>
          <p className="text-sm text-gray-500 text-center line-clamp-2">
            {product.description}
          </p>
        </div>
      ))}

      {/* Modal Detail Produk */}
      {showProduct && (
        <div className="fixed h-screen w-screen top-0 left-0 bg-black/50 flex justify-center items-center">
          <div className="relative w-1/2 bg-white flex flex-col items-center gap-4 p-8 rounded-lg shadow-lg">
            <button
              className="absolute top-3 right-3 bg-gray-200 px-3 py-1 rounded-full text-lg"
              onClick={() => setShowProduct(null)}
            >
              ✖
            </button>
            {isLoadingDetail ? (
              <p className="text-gray-500">Loading product details...</p>
            ) : isErrorDetail ? (
              <p className="text-red-500">Failed to load product details.</p>
            ) : (
              <>
                <Image
                  src={detailProduct?.image || ""}
                  alt={detailProduct?.title || "Product image"
                  width={200}
                  height={200}
                  className="object-contain w-40 h-40"
                />
                <h2 className="text-xl font-bold">{detailProduct?.title}</h2>
                <p className="text-lg text-blue-600">${detailProduct?.price}</p>
                <p className="text-gray-500">{detailProduct?.description}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

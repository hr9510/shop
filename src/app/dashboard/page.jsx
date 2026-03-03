"use client";
import React, { useState, useMemo, useEffect } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function Page() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");


  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = (p.name || "").toLowerCase();
      const matchName = name.includes(search.toLowerCase());
      const matchBrand = brand === "" || p.brand === brand;
      const matchCategory = category === "" || p.category === category;
      return matchName && matchBrand && matchCategory && p.status === "active";
    });
  }, [products, search, brand, category]);

  useEffect(() => {
  const load = async () => {
    const data = await fetch("https://shop-backend-l9z3.onrender.com/get_product", {
      credentials: 'include',
      method: "GET"
    });
    let res = await data.json();
    setProducts(Array.isArray(res) ? res.reverse() : []);
    setLoading(false);
  };
  load();
}, []);

  // low stock
  const lowStock = filteredProducts.filter(p => Number(p.quantity) <= 2);

  return (
    <div  className="min-h-screen px-4 pt-20 pb-16 bg-gray-200">
      <Header/>
      {loading? <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading dashboard...
      </div>:  <div>

      {/* TITLE */}
      <h1 className="mb-8 text-2xl font-bold text-center">
        Available Products
      </h1>

      {/* FILTERS */}
      <div className="grid max-w-5xl gap-4 mx-auto mb-10 md:grid-cols-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="w-full p-3 border rounded-lg"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b.toUpperCase()}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">All Category</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>

      </div>

      {/* PRODUCT GRID */}
      <div className="grid max-w-6xl grid-cols-2 gap-6 mx-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

        {filteredProducts.map(p => (
          <div key={p.id} className="transition bg-white shadow rounded-xl hover:shadow-lg">

            <img
              src={p.category === "phone" ? "/mobile.jpg" : "/accessories.png"}
              className="object-cover w-full h-44 rounded-t-xl"
            />

            <div className="p-3 text-center">
              <h2 className="font-semibold">
                {p.brand} {p.name}
              </h2>

              {p.category === "phone" && (
                <p className="text-sm text-gray-600">
                  {p.ram}GB / {p.storage}GB
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Qty: {p.quantity}
              </p>
            </div>

          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No products found
          </p>
        )}

      </div>

      {/* LOW STOCK */}
      <h2 className="mt-16 mb-6 text-xl font-bold text-center">
        Low Stock
      </h2>

      <div className="grid max-w-6xl grid-cols-2 gap-6 mx-auto sm:grid-cols-3 md:grid-cols-4">
        {lowStock.map(p => (
          <div key={p.id} className="p-4 text-center border border-red-300 bg-red-50 rounded-xl">
            {p.brand} {p.name}
            <p className="text-sm text-red-600">Only {p.quantity} left</p>
          </div>
        ))}

        {lowStock.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No low stock items 🎉
          </p>
        )}
      </div>

    </div>}
   </div>
  );
}

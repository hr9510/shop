"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function Page() {


  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    product_id: "",
    quantity: "",
    purchase_price: "",
    supplier_name: "",
    purchase_date: ""
  });

  // LOAD DATA
  const loadData = async () => {
    try {
      const prod = await api("/get_product");
      const st = await api("/get_stock");
      setProducts(Array.isArray(prod) ? [...prod].reverse() : []);
      setStock(Array.isArray(st) ? [...st].reverse() : []);
    } catch (error) {
      console.log(error)
    }
  };
useEffect(() => {

  const init = async () => {
    try {
      const prod = await api("/get_product");
      const st = await api("/get_stock");

      setProducts(Array.isArray(prod) ? [...prod].reverse() : []);
      setStock(Array.isArray(st) ? [...st].reverse() : []);

    } catch (error) {
      console.log(error);
    }
  };

  init();

}, []);
  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ADD OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (isEdit) {
        await api("/update_stock", {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
            id: Number(formData.id),
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity),
            purchase_price: Number(formData.purchase_price)
          })
        });

        alert("Stock Updated");

      } else {
        await api("/fill_stock", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity),
            purchase_price: Number(formData.purchase_price)
          })
        });

        alert("Stock Added");
      }

      resetForm();
      loadData();

    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      product_id: "",
      quantity: "",
      purchase_price: "",
      supplier_name: "",
      purchase_date: ""
    });
    setShowForm(false);
    setIsEdit(false);
  };

  // EDIT
  const editStock = (entry) => {
    setFormData({
      id: entry.id,
      product_id: entry.product_id,
      quantity: entry.quantity,
      purchase_price: entry.purchase_price,
      supplier_name: entry.supplier_name,
      purchase_date: entry.purchase_date?.split("T")[0]
    });

    setIsEdit(true);
    setShowForm(true);
  };

  // DELETE
  const deleteStock = async (id) => {
    if (!confirm("Delete this stock entry?")) return;

    try {
      await api("/delete_stock", {
        method: "DELETE",
        body: JSON.stringify({ id })
      });

      setStock(prev => prev.filter(s => s.id !== id));

    } catch (err) {
      alert(err.message);
    }
  };

  const getProductName = (id) => {
    const p = products.find(x => x.id === id);
    return p ? `${p.brand} ${p.name}` : "Unknown";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-200">
      <Header/>
      <h1 className="mb-6 text-2xl font-bold text-center">
        Stock Management
      </h1>

      {!showForm && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg"
          >
            Add Stock
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-xl p-6 mx-auto space-y-4 bg-white rounded-xl">

          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.brand} {p.name}
              </option>
            ))}
          </select>

          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            placeholder="Purchase Price"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleChange}
            placeholder="Supplier"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 text-white bg-green-600 rounded">
              {isEdit ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
          </div>

        </form>
      )}

      {/* STOCK HISTORY */}
      <div className="p-6 mt-10 bg-white rounded-xl">
        <h2 className="mb-4 text-lg font-bold">Stock History</h2>

        {stock.length === 0 && (
          <p className="text-gray-500">No stock entries</p>
        )}

        {stock.map(s => (
          <div key={s.id} className="flex items-center justify-between py-3 border-b">

            <div>
              <p className="font-semibold">
                {getProductName(s.product_id)}
              </p>
              <p className="text-sm text-gray-600">
                Qty: {s.quantity} | ₹{s.purchase_price}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(s.purchase_date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editStock(s)}
                className="px-3 py-1 text-white bg-yellow-500 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteStock(s.id)}
                className="px-3 py-1 text-white bg-red-600 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
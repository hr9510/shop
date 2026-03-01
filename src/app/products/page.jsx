"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Page() {

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  let router = useRouter()

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    brand: "",
    category: "",
    ram: "",
    storage: "",
    status: "active"
  });

  // LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const data = await api("/get_product");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {

  const init = async () => {
    try {
      const data = await api("/get_product");
      setProducts(Array.isArray(data) ? data : []);

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

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api("/update_product", {
          method: "PUT",
          body: JSON.stringify(formData)
        });
        alert("Product Updated");
      } else {
        await api("/add_product", {
          method: "POST",
          body: JSON.stringify(formData)
        });
        alert("Product Added");
      }

      setShowForm(false);
      setEditing(false);
      setFormData({
        id: null,
        name: "",
        brand: "",
        category: "",
        ram: "",
        storage: "",
        status: "active"
      });

      loadProducts();

    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await api("/delete_product", {
        method: "DELETE",
        body: JSON.stringify({ id })
      });

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // EDIT
  const editProduct = (product) => {
    setShowForm(true);
    setEditing(true);
    setFormData(product);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-200">
      <Header/>
      <h1 className="mb-6 text-2xl font-bold text-center">
        Product Management
      </h1>

      {!showForm && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg"
          >
            Add Product
          </button>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl p-6 mx-auto space-y-4 bg-white shadow rounded-xl"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full p-2 border rounded"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="phone">Phone</option>
            <option value="earbuds">Earbuds</option>
            <option value="keypad">Keypad</option>
          </select>

          {formData.category === "phone" && (
            <>
              <input
                name="ram"
                value={formData.ram || ""}
                onChange={handleChange}
                placeholder="RAM"
                className="w-full p-2 border rounded"
              />

              <input
                name="storage"
                value={formData.storage || ""}
                onChange={handleChange}
                placeholder="Storage"
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-5 py-2 text-white bg-green-600 rounded"
            >
              {editing ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(false);
              }}
              className="px-5 py-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-center bg-white border">
          <thead className="text-white bg-gray-800">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">RAM</th>
              <th className="p-2 border">Storage</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.brand}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border">{p.ram || "-"}</td>
                <td className="p-2 border">{p.storage || "-"}</td>
                <td className="p-2 border">{p.category}</td>

                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white ${p.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                    {p.status}
                  </span>
                </td>

                <td className="p-2 space-x-2 space-y-2 border">
                  <button
                    onClick={() => editProduct(p)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-3 py-1 text-white bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function Page() {


  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    product_id: "",
    quantity: "",
    purchase_price: "",
    selling_price: "",
    selling_date: ""
  });

  // LOAD DATA
  const loadData = async () => {
    try {
      const prod = await api("/get_product");
      const sale = await api("/get_sale");
      setProducts(prod);
      setSales(Array.isArray(sale) ? sale : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

  const init = async () => {
    try {
      const prod = await api("/get_product");
      const sale = await api("/get_sale");

      setProducts(Array.isArray(prod) ? prod : []);
      setSales(Array.isArray(sale) ? sale : []);

    } catch (error) {
      console.log(error);
    }
  };

  init();

}, []);
  // INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ADD OR UPDATE SALE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (isEdit) {
        await api("/update_sale", {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
            id: Number(formData.id),
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity),
            purchase_price: Number(formData.purchase_price),
            selling_price: Number(formData.selling_price)
          })
        });

        alert("Sale Updated");

      } else {
        await api("/add_sale", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity),
            purchase_price: Number(formData.purchase_price),
            selling_price: Number(formData.selling_price)
          })
        });

        alert("Sale Recorded");
      }

      resetForm();
      loadData();

    } catch (err) {
      alert(err.message);
    }
  };

  // RESET
  const resetForm = () => {
    setFormData({
      id: "",
      product_id: "",
      quantity: "",
      purchase_price: "",
      selling_price: "",
      selling_date: ""
    });
    setIsEdit(false);
    setShowForm(false);
  };

  // EDIT
  const editSale = (sale) => {
    setFormData({
      id: sale.id,
      product_id: sale.product_id,
      quantity: sale.quantity,
      purchase_price: sale.purchase_price,
      selling_price: sale.selling_price,
      selling_date: sale.selling_date?.split("T")[0]
    });

    setIsEdit(true);
    setShowForm(true);
  };

  // DELETE
  const deleteSale = async (id) => {
    if (!confirm("Delete this sale? Stock will be restored.")) return;

    try {
      await api("/delete_sale", {
        method: "DELETE",
        body: JSON.stringify({ id })
      });

      setSales(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // FIND PRODUCT NAME
  const getProductName = (id) => {
    const p = products.find(x => x.id === id);
    return p ? `${p.brand} ${p.name}` : "Unknown Product";
  };

  // PROFIT CALCULATION
  const calcProfit = (sale) => {
    return (sale.selling_price - sale.purchase_price) * sale.quantity;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-200">
      <Header/>
      <h1 className="mb-6 text-2xl font-bold text-center">Sales Management</h1>

      {!showForm && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg"
          >
            Add Sale
          </button>
        </div>
      )}

      {/* FORM */}
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
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="Selling Price"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="date"
            name="selling_date"
            value={formData.selling_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 text-white bg-green-600 rounded">
              {isEdit ? "Update Sale" : "Save Sale"}
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

      {/* SALES HISTORY */}
      <div className="p-6 mt-10 bg-white rounded-xl">
        <h2 className="mb-4 text-lg font-bold">Sales History</h2>

        {sales.length === 0 && (
          <p className="text-gray-500">No sales yet</p>
        )}

        {sales.map(s => (
          <div key={s.id} className="flex items-center justify-between py-3 border-b">

            <div>
              <p className="font-semibold">{getProductName(s.product_id)}</p>

              <p className="text-sm text-gray-600">
                Qty: {s.quantity} | Buy ₹{s.purchase_price} → Sell ₹{s.selling_price}
              </p>

              <p className="text-sm font-semibold text-green-600">
                Profit: ₹{calcProfit(s)}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(s.selling_date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editSale(s)}
                className="px-3 py-1 text-white bg-yellow-500 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSale(s.id)}
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
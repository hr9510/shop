"use client";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function Report() {

  const [sales, setSales] = useState([]);
  const [others, setOthers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {

  const init = async () => {
    try {
      const s = await api("/get_sale");
      const o = await api("/get_other_manages");
      const p = await api("/get_product");

      setSales(Array.isArray(s) ? s : []);
      setOthers(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p) ? p : []);

    } catch (error) {
      console.log(error);
    }
  };

  init();

}, []);

  const stats = useMemo(() => {

    let todaySale = 0;
    let todayProfit = 0;
    let weeklyProfit = 0;
    let monthlyProfit = 0;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    sales.forEach(s => {
      if (!s.selling_date) return;

      const saleDate = new Date(s.selling_date);
      const selling = Number(s.selling_price || 0);
const buying = Number(s.purchase_price || 0);
const qty = Number(s.quantity || 0);

const profit = (selling - buying) * qty;
const amount = selling * qty;

      const saleDateStr = new Date(s.selling_date).toISOString().split("T")[0];

if (saleDateStr === todayStr) {
        todaySale += amount;
        todayProfit += profit;
      }

      if (saleDate >= weekAgo) weeklyProfit += profit;
      if (saleDate >= monthAgo) monthlyProfit += profit;
    });

    others.forEach(o => {
      if (!o.date) return;

      const d = new Date(o.date);

      if (o.which_type === "expense") {
        if (o.date === todayStr) todayProfit -= o.amount;
        if (d >= weekAgo) weeklyProfit -= o.amount;
        if (d >= monthAgo) monthlyProfit -= o.amount;
      }

      if (o.which_type === "income") {
        if (o.date === todayStr) todayProfit += o.amount;
        if (d >= weekAgo) weeklyProfit += o.amount;
        if (d >= monthAgo) monthlyProfit += o.amount;
      }
    });

    return { todaySale, todayProfit, weeklyProfit, monthlyProfit };

  }, [sales, others]);

  const lowStock = products.filter(p => p.quantity <= 2);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Header/>
      <h1 className="mb-10 text-3xl font-bold text-center">
        Business Report
      </h1>

      <div className="grid gap-6 md:grid-cols-4">
        <Card title="Today's Sale" value={`₹ ${stats.todaySale}`} color="bg-blue-500" />
        <Card title="Today's Net Profit" value={`₹ ${stats.todayProfit}`} color="bg-green-500" />
        <Card title="Weekly Profit" value={`₹ ${stats.weeklyProfit}`} color="bg-purple-500" />
        <Card title="Monthly Profit" value={`₹ ${stats.monthlyProfit}`} color="bg-orange-500" />
      </div>

      <div className="p-6 mt-12 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-bold">
          Low Stock Alert
        </h2>

        {lowStock.length === 0 ? (
          <p>No low stock items 🎉</p>
        ) : (
          <ul className="space-y-2">
            {lowStock.map(p => (
              <li key={p.id} className="flex justify-between pb-2 border-b">
                <span>{p.brand} {p.name}</span>
                <span className="text-red-600">
                  Only {p.quantity} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow ${color}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
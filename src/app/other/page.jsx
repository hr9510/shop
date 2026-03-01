"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function Page() {


  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    note: "",
    amount: "",
    which_type: "",
    date: ""
  });

  // LOAD
  const loadData = async () => {
    try {
      const data = await api("/get_other_manages");
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {

  const init = async () => {
    try {
      const data = await api("/get_other_manages");
      setRecords(Array.isArray(data) ? data : []);

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

  // ADD OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (isEdit) {
        await api("/update_other_manages", {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
            id: Number(formData.id),
            amount: Number(formData.amount)
          })
        });

        alert("Record Updated");

      } else {
        await api("/add_other_manages", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            amount: Number(formData.amount)
          })
        });

        alert("Record Saved");
      }

      resetForm();
      loadData();

    } catch (err) {
      alert(err.message);
    }
  };

  // EDIT
  const editRecord = (rec) => {
    setFormData({
      id: rec.id,
      title: rec.title,
      note: rec.note,
      amount: rec.amount,
      which_type: rec.which_type,
      date: rec.date?.split("T")[0]
    });

    setIsEdit(true);
    setShowForm(true);
  };

  // DELETE
  const deleteRecord = async (id) => {
    if (!confirm("Delete this record?")) return;

    try {
      await api("/delete_other_manages", {
  method: "DELETE",
  body: JSON.stringify({ id })
});

loadData();

      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // RESET
  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      note: "",
      amount: "",
      which_type: "",
      date: ""
    });
    setIsEdit(false);
    setShowForm(false);
  };

  // FILTER
  const filtered = filter
    ? records.filter(r => r.which_type === filter)
    : records;

  // COLOR
  const getColor = (type) => {
    if (type === "income" || type === "to receive") return "text-green-600";
    if (type === "expense" || type === "to pay") return "text-red-600";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-200">
      <Header/>
      <h1 className="mb-6 text-2xl font-bold text-center">
        Other Income / Expenses
      </h1>

      {!showForm && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg"
          >
            Add Record
          </button>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-xl p-6 mx-auto space-y-4 bg-white rounded-xl">

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title (Rent, Electricity Bill...)"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note"
            className="w-full p-2 border rounded"
          />

          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full p-2 border rounded"
            required
          />

          <select
            name="which_type"
            value={formData.which_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="to pay">To Pay</option>
            <option value="to receive">To Receive</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 text-white bg-green-600 rounded">
              {isEdit ? "Update Record" : "Save Record"}
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

      {/* FILTER */}
      <div className="max-w-xl mx-auto mt-10 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">All</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
          <option value="to pay">To Pay</option>
          <option value="to receive">To Receive</option>
        </select>
      </div>

      {/* HISTORY */}
      <div className="p-6 bg-white rounded-xl">
        <h2 className="mb-4 font-bold">History</h2>

        {filtered.length === 0 && (
          <p className="text-gray-500">No records</p>
        )}

        {filtered.map(r => (
          <div key={r.id} className="flex items-center justify-between py-3 border-b">

            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-gray-600">{r.note}</p>
              <p className="text-xs text-gray-400">
                {r.date ? new Date(r.date).toLocaleDateString() : "-"}
              </p>
            </div>

            <div className="text-right">
              <p className={`font-bold ${getColor(r.which_type)}`}>
                ₹ {r.amount}
              </p>
              <p className="text-xs capitalize">{r.which_type}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => editRecord(r)}
                  className="px-2 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteRecord(r.id)}
                  className="px-2 py-1 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
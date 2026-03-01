"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow">
      
      <div className="flex items-center justify-between h-16 px-6">
        
        <h1 className="text-xl font-bold text-gray-800">
          Admin Panel
        </h1>

          <nav className="hidden gap-8 font-medium md:flex">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/products">Products</Link>
            <Link href="/stock">Stocks</Link>
            <Link href="/sale">Sales</Link>
            <Link href="/other">Other</Link>
            <Link href="/report">Report</Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
      </div>

      {open  && (
        <nav className="flex flex-col bg-white border-t md:hidden">
          <Link onClick={()=>setOpen(false)} href="/dashboard" className="p-4 border-b">Dashboard</Link>
          <Link onClick={()=>setOpen(false)} href="/products" className="p-4 border-b">Products</Link>
          <Link onClick={()=>setOpen(false)} href="/stock" className="p-4 border-b">Stocks</Link>
          <Link onClick={()=>setOpen(false)} href="/sale" className="p-4 border-b">Sales</Link>
          <Link onClick={()=>setOpen(false)} href="/other" className="p-4 border-b">Other</Link>
          <Link onClick={()=>setOpen(false)} href="/report" className="p-4 border-b">Report</Link>
        </nav>
      )}
    </header>
  );
}
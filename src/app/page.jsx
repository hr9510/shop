"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { api } from "@/lib/api";

export default function Page() {

  const [show, setShow] = useState(false);
  const [data, setData] = useState({ user_email: "", password: "", user_code: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api("/login_user", {
  method: "POST",
  body: JSON.stringify(data)
});

router.replace("/dashboard");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='w-full min-h-screen py-20 bg-gray-200'>
      <h1 className="py-5 text-2xl font-bold text-center text-gray-800 ">
          Log-in
        </h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center py-6 mx-auto space-y-5 bg-white rounded w-80'>

        <input name='user_code' type='text' value={data.user_code} onChange={handleChange} placeholder='Enter Code' className='px-4 py-2 bg-gray-200 rounded w-60'/>

        <input name='user_email' type='email' value={data.user_email} onChange={handleChange} placeholder='Enter Email' className='px-4 py-2 bg-gray-200 rounded w-60'/>

        <input name='password' type={show ? "password" : "text"} value={data.password} onChange={handleChange} placeholder='Enter Password' className='px-4 py-2 bg-gray-200 rounded w-60'/>

        <button type='button' onClick={()=>setShow(!show)} className='py-1 text-white bg-blue-500 rounded w-60'>Show</button>

        <button type='submit' className='py-1 text-white bg-blue-600 rounded w-60'>Login</button>

      </form>
    </div>
  );
}
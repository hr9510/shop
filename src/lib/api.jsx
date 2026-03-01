const BASE = "https://shop-backend-l9z3.onrender.com";

export async function api(path, options = {}) {

  const res = await fetch(BASE + path, {
    credentials: "include",
    method: options.method || "GET",
    headers: options.body
      ? { "Content-Type": "application/json", ...(options.headers || {}) }
      : options.headers,
    body: options.body
  });

  // try refresh
  // if (res.status === 401) {
  //   const refresh = await fetch(BASE + "/refresh", {
  //     method: "POST",
  //     credentials: "include"
  //   });

  //   if (refresh.ok) {
  //     const retry = await fetch(BASE + path, {
  //       method: options.method || "GET",
  //       credentials: "include",
  //       headers: options.body
  //         ? { "Content-Type": "application/json", ...(options.headers || {}) }
  //         : options.headers,
  //       body: options.body
  //     });

  //     if (!retry.ok) throw new Error("Session expired");
  //     return retry.json();
  //   }

  //   throw new Error("Login again");
  // }

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Server error" }));
    throw new Error(data.message || data.msg || "Server error");
  }

  return res.json();
}

"use client";

// Thin fetch wrapper for client components. Throws on non-ok responses
// with the server's error message attached.
export async function api(path, { method = "GET", body, ...rest } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data.code;
    err.issues = data.issues;
    throw err;
  }
  return data;
}

/**
 * Upload an image File to ImgBB via our server endpoint. Returns the public URL.
 */
export async function uploadFile(file, folder = "uploads") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch("/api/uploads", { method: "POST", body: form });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "Upload failed");
  }
  return data.url;
}

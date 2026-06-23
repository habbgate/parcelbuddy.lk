import { NextResponse } from "next/server";

// Standard JSON success response.
export function ok(data = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

// Standard JSON error response.
export function fail(message, status = 400, extra = {}) {
  return NextResponse.json(
    { ok: false, error: message, ...extra },
    { status }
  );
}

// Wrap a route handler so thrown errors return a clean 500 instead of crashing.
export function handler(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      console.error("[API ERROR]", err);
      if (err?.name === "ZodError") {
        return fail("Validation failed", 422, { issues: err.issues });
      }
      const status = err?.status || 500;
      const extra = err?.code ? { code: err.code } : {};
      return fail(err?.message || "Internal server error", status, extra);
    }
  };
}

// Only expose the sender's first name publicly.
export function firstNameOnly(fullName = "") {
  return String(fullName).trim().split(/\s+/)[0] || "Sender";
}


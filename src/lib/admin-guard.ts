import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type GuardResult =
  | { error: "unauthorized" | "forbidden"; status: 401 | 403 }
  | { error: null; session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> };

/**
 * ตรวจ session ฝั่ง server สำหรับ Route Handlers ของ /api/admin/*
 * - ไม่มี session → unauthorized (401)
 * - role ไม่ใช่ admin → forbidden (403)
 */
export async function requireAdmin(): Promise<GuardResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: "unauthorized", status: 401 };
  if (session.user.role !== "admin") return { error: "forbidden", status: 403 };

  return { error: null, session };
}

/** สร้าง JSON error response จากผลของ requireAdmin */
export function adminGuardResponse(guard: { error: string; status: number }) {
  return Response.json({ error: guard.error }, { status: guard.status });
}

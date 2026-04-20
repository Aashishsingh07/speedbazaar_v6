import { cookies } from "next/headers";

export type SessionUser = {
  email: string;
  role: "admin" | "user" | "seller";
};

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;

  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}

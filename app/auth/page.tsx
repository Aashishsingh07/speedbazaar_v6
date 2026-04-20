"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SessionUser = {
  email: string;
  role: "admin" | "user" | "seller";
};

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("ashish6201503496@gmail.com");
  const [password, setPassword] = useState("Kavya@12");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  async function loadSession() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok && data?.user) {
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || "Login failed");
        return;
      }

      setMessage("Login successful");

      const user = data?.user as SessionUser | undefined;

      await loadSession();

      if (user?.role === "admin") {
        router.push(nextPath || "/admin/products");
        router.refresh();
        return;
      }

      if (user?.role === "seller") {
        router.push("/seller");
        router.refresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || "Registration failed");
        return;
      }

      setMessage(data?.message || "Registered successfully");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLoading(true);
      setMessage("");

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setSession(null);
      setMessage("Logged out");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-4xl font-bold text-[#1b0b5a]">Login</h1>

          <div className="mb-5 flex gap-3">
            <button
              onClick={() => setMode("register")}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                mode === "register"
                  ? "bg-[#2d006b] text-white"
                  : "bg-[#f1f1f7] text-[#2d006b]"
              }`}
            >
              Register
            </button>

            <button
              onClick={() => setMode("login")}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                mode === "login"
                  ? "bg-[#2d006b] text-white"
                  : "bg-[#f1f1f7] text-[#2d006b]"
              }`}
            >
              Login
            </button>
          </div>

          <p className="mb-5 text-xl text-gray-600">
            Use USER for shoppers, SELLER for manual product entry, or ADMIN for admin pages.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-[#d9dcec] bg-[#eef1fb] px-5 py-4 text-xl outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-[#d9dcec] bg-[#eef1fb] px-5 py-4 text-xl outline-none"
          />

          <div className="mb-5 flex gap-3">
            {mode === "login" ? (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="rounded-2xl bg-[#2d006b] px-8 py-3 text-xl font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Login"}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="rounded-2xl bg-[#2d006b] px-8 py-3 text-xl font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Register"}
              </button>
            )}

            <button
              onClick={handleLogout}
              disabled={loading}
              className="rounded-2xl bg-[#f1f1f7] px-8 py-3 text-xl font-semibold text-[#2d006b] disabled:opacity-60"
            >
              Logout
            </button>
          </div>

          <div className="rounded-2xl border border-[#e3e6f0] bg-[#f7f8fc] px-5 py-4 text-lg text-[#2d006b]">
            {message || "Ready."}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-3xl font-bold text-[#1b0b5a]">Current session</h2>

          <div className="space-y-4 text-2xl text-[#1b0b5a]">
            <p>
              <span className="font-bold">Name:</span>{" "}
              {session?.email ? session.email.split("@")[0] : ""}
            </p>
            <p>
              <span className="font-bold">Email:</span> {session?.email || ""}
            </p>
            <p>
              <span className="font-bold">Role:</span> {session?.role || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

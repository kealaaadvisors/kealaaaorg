"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "forgot";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError(signInError.message);
    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `https://www.keala.io/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess("Check your email for a password reset link.");
    }

    setLoading(false);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setSuccess("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <Image
            src="/KealaLogo.png"
            alt="Keala Advisors"
            width={180}
            height={44}
            style={{ objectFit: "contain", borderRadius: 4 }}
          />
        </div>

        {/* Card */}
        <div
          className="login-card"
          style={{
            background: "#1a2332",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "2rem",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#dcdad5",
              marginBottom: "0.25rem",
            }}
          >
            {mode === "signin" ? "Sign in" : "Reset password"}
          </h1>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#7a7872",
              marginBottom: "1.75rem",
            }}
          >
            {mode === "signin"
              ? "Access the internal portal"
              : "Enter your email and we'll send you a reset link"}
          </p>

          {resetSuccess && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "#6fcf97",
                background: "rgba(111,207,151,0.08)",
                border: "1px solid rgba(111,207,151,0.2)",
                borderRadius: 6,
                padding: "0.5rem 0.75rem",
                marginBottom: "1rem",
              }}
            >
              Password updated successfully. Please sign in.
            </p>
          )}

          {mode === "signin" ? (
            <form
              onSubmit={handleSignIn}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@keala.io"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              <div style={{ textAlign: "right", marginTop: "-0.25rem" }}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); switchMode("forgot"); }}
                  style={{
                    fontSize: "0.72rem",
                    color: "#575ECF",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#e05252",
                    marginTop: "-0.1rem",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle(loading)}
              >
                {loading ? "Please wait…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleForgotPassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@keala.io"
                  style={inputStyle}
                />
              </div>

              {error && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#e05252",
                    marginTop: "-0.1rem",
                  }}
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#6fcf97",
                    marginTop: "-0.1rem",
                  }}
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle(loading)}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <button
                type="button"
                onClick={() => switchMode("signin")}
                style={{
                  fontSize: "0.78rem",
                  color: "#7a7872",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "color 0.2s",
                }}
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.78rem",
            color: "#7a7872",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{
              color: "#575ECF",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  color: "#9a9790",
  marginBottom: "0.4rem",
  letterSpacing: "0.03em",
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  padding: "0.6rem 0.8rem",
  color: "#c5c1b9",
  fontSize: "0.875rem",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  outline: "none",
  transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
  boxSizing: "border-box",
};

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: "100%",
  background: loading ? "rgba(87,94,207,0.4)" : "#575ECF",
  color: loading ? "rgba(255,255,255,0.4)" : "#ffffff",
  border: "none",
  borderRadius: 6,
  padding: "0.65rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  cursor: loading ? "not-allowed" : "pointer",
  marginTop: "0.15rem",
  transition: "background 0.2s cubic-bezier(0.4,0,0.2,1)",
  letterSpacing: "0.01em",
});

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in — CREATORS",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-6">
      <div className="relative rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-12 md:p-16 transition-all duration-500 hover:border-[var(--border-hover)] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_40px_rgba(0,0,0,0.4)]">
        {/* Header — monogram + logo + editorial welcome */}
        <div className="text-center mb-12 stagger-children">
          {/* Monogram mark */}
          <span className="monogram text-xs tracking-[0.35em]">CR</span>

          {/* Logo — refined scale */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mkultra-logo-pink.jpg"
            alt="CREATORS"
            className="h-8 w-auto mx-auto mt-6"
          />

          {/* Welcome — editorial italic */}
          <p className="editorial-italic text-lg text-[var(--text-secondary)] mt-6">
            Welcome back.
          </p>
        </div>

        {/* Luxury divider */}
        <div className="luxury-divider w-full mb-10" />

        {/* Login form */}
        <LoginForm />
      </div>
    </div>
  );
}

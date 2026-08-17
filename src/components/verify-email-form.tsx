"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function VerifyEmailForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function requestCode() {
    setPending(true);
    setMessage("");
    setError("");
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      if (result.error) setError(result.error.message ?? "Não foi possível reenviar o email.");
      else setMessage("Enviamos um novo código de confirmação. Confira seu email.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível reenviar o código.");
    } finally { setPending(false); }
  }

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestCode();
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    try {
      const result = await authClient.emailOtp.verifyEmail({ email, otp });
      if (result.error) setError(result.error.message ?? "O código de confirmação é inválido.");
      else { setMessage("Email confirmado. Redirecionando..."); router.push("/day"); }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível confirmar o código.");
    } finally { setPending(false); }
  }

  return <div className="mt-6 grid gap-4">
    {initialEmail ? <div className="rounded-xl bg-[var(--surface-blue)] p-3 text-sm">Código enviado para <strong>{email}</strong>.</div> : <form className="grid gap-3" onSubmit={sendCode}>
      <label className="field-label">Email<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <button className="btn btn-primary" disabled={pending}>{pending ? "Enviando..." : "Enviar código"}</button>
    </form>}
    <form className="grid gap-3" onSubmit={verifyCode}>
    <label className="field-label">Código de confirmação<input className="input mono" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" required /></label>
    {message && <p className="alert alert-success">{message}</p>}
    {error && <p className="alert alert-error">{error}</p>}
    <div className="flex flex-wrap gap-2"><button className="btn btn-primary" disabled={pending || !email}>{pending ? "Confirmando..." : "Confirmar código"}</button>{initialEmail && <button type="button" className="btn btn-secondary" disabled={pending} onClick={() => void requestCode()}>Reenviar código</button>}</div>
    </form>
  </div>;
}

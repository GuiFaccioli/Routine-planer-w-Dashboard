"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function VerifyEmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const result = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    if (result.error) setError(result.error.message ?? "Não foi possível reenviar o email.");
    else setMessage("Enviamos um código de confirmação. Confira seu email e informe o código abaixo.");
    setPending(false);
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const result = await authClient.emailOtp.verifyEmail({ email, otp });
    if (result.error) setError(result.error.message ?? "O código de confirmação é inválido.");
    else { setMessage("Email confirmado. Redirecionando..."); router.push("/day"); }
    setPending(false);
  }

  return <div className="mt-6 grid gap-4">
    <form className="grid gap-3" onSubmit={sendCode}>
    <label className="field-label">Email<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
    <button className="btn btn-primary" disabled={pending}>{pending ? "Enviando..." : "Enviar código"}</button>
    </form>
    <form className="grid gap-3" onSubmit={verifyCode}>
    <label className="field-label">Código de confirmação<input className="input mono" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" required /></label>
    {message && <p className="alert alert-success">{message}</p>}
    {error && <p className="alert alert-error">{error}</p>}
    <button className="btn btn-secondary" disabled={pending || !email}>{pending ? "Confirmando..." : "Confirmar código"}</button>
    </form>
  </div>;
}

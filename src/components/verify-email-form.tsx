"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export function VerifyEmailForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const result = await authClient.sendVerificationEmail({ email, callbackURL: "/verify-email" });
    if (result.error) setError(result.error.message ?? "Não foi possível reenviar o email.");
    else setMessage("Se o email estiver cadastrado, enviaremos um novo link de confirmação.");
    setPending(false);
  }

  return <form className="mt-6 grid gap-3" onSubmit={submit}>
    <label className="grid gap-1 text-sm font-bold">Email<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
    {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <button className="btn btn-primary" disabled={pending}>{pending ? "Enviando..." : "Reenviar confirmação"}</button>
  </form>;
}

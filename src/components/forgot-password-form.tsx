"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); setError(""); const email = String(new FormData(event.currentTarget).get("email")); const result = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" }); if (result.error) setError(result.error.message ?? "Não foi possível enviar o email."); else setMessage("Se este email estiver cadastrado, enviaremos as instruções de recuperação."); }
  return <div className="panel w-full max-w-md p-7"><h1 className="text-2xl font-black">Recuperar senha</h1><p className="mt-2 text-sm muted">Informe seu email e enviaremos um link seguro.</p><form className="mt-6 grid gap-4" onSubmit={submit}><input className="input" name="email" type="email" placeholder="voce@email.com" required />{message && <p className="rounded-xl bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent)]">{message}</p>}{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button className="btn btn-primary">Enviar instruções</button></form><Link className="mt-5 inline-block text-sm text-[var(--accent)]" href="/sign-in">Voltar para entrar</Link></div>;
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); setError(""); const email = String(new FormData(event.currentTarget).get("email")); const result = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" }); if (result.error) setError(result.error.message ?? "Não foi possível enviar o email."); else setMessage("Se este email estiver cadastrado, enviaremos as instruções de recuperação."); }
  return <div className="auth-card"><div className="auth-card-header"><p className="eyebrow">Acesso</p><h1>Recuperar senha</h1><p className="help-text mt-2">Informe seu email e enviaremos um link seguro.</p></div><form className="grid gap-4" onSubmit={submit}><label className="field-label">Email<input className="input" name="email" type="email" placeholder="voce@email.com" required /></label>{message && <p className="alert alert-success">{message}</p>}{error && <p className="alert alert-error">{error}</p>}<button className="btn btn-primary">Enviar instruções</button></form><Link className="text-link mt-5 inline-block" href="/sign-in">Voltar para entrar</Link></div>;
}

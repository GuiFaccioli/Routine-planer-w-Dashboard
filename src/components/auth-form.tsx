"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      const result = mode === "sign-in"
        ? await authClient.signIn.email({ email: String(values.email), password: String(values.password), callbackURL: "/day" })
        : await authClient.signUp.email({ name: String(values.name), email: String(values.email), password: String(values.password), callbackURL: "/verify-email" });
      if (result.error) setError(result.error.message ?? "Não foi possível concluir a autenticação.");
      else router.push(mode === "sign-in" ? "/day" : "/verify-email");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível conectar ao serviço de autenticação.");
    } finally {
      setPending(false);
    }
  }
  return <div className="auth-card"><div className="auth-card-header"><Link href="/sign-in" className="brand">ritmo<span className="brand-mark">.</span></Link><p className="eyebrow mt-10">Seu espaço diário</p><h1 className="mt-3">{mode === "sign-in" ? "Bem-vindo de volta" : "Crie seu espaço"}</h1><p className="help-text mt-2">Planeje com calma. Registre o que realmente aconteceu.</p></div><form className="grid gap-4" onSubmit={submit}>{mode === "sign-up" && <label className="field-label">Nome<input className="input" name="name" required /></label>}<label className="field-label">Email<input className="input" name="email" type="email" required /></label><label className="field-label">Senha<input className="input" name="password" type="password" minLength={8} required /></label>{error && <p className="alert alert-error">{error}</p>}<button className="btn btn-primary mt-2 w-full" disabled={pending}>{pending ? "Aguarde..." : mode === "sign-in" ? "Entrar" : "Criar conta"}</button></form><div className="auth-links"><Link className="text-link" href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>{mode === "sign-in" ? "Criar uma conta" : "Já tenho conta"}</Link>{mode === "sign-in" && <Link className="text-link" href="/forgot-password">Esqueci a senha</Link>}</div></div>;
}

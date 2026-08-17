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
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = mode === "sign-in"
      ? await authClient.signIn.email({ email: String(values.email), password: String(values.password), callbackURL: "/day" })
      : await authClient.signUp.email({ name: String(values.name), email: String(values.email), password: String(values.password), callbackURL: "/verify-email" });
    setPending(false);
    if (result.error) setError(result.error.message ?? "Não foi possível concluir a autenticação."); else router.push(mode === "sign-in" ? "/day" : "/verify-email");
  }
  return <div className="panel w-full max-w-md p-7"><div className="mb-7"><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">ritmo.</p><h1 className="text-3xl font-black">{mode === "sign-in" ? "Bem-vindo de volta" : "Crie seu espaço"}</h1><p className="mt-2 text-sm muted">Planeje com calma. Registre o que realmente aconteceu.</p></div><form className="grid gap-4" onSubmit={submit}>{mode === "sign-up" && <label className="grid gap-1 text-sm font-bold">Nome<input className="input" name="name" required /></label>}<label className="grid gap-1 text-sm font-bold">Email<input className="input" name="email" type="email" required /></label><label className="grid gap-1 text-sm font-bold">Senha<input className="input" name="password" type="password" minLength={8} required /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button className="btn btn-primary mt-2" disabled={pending}>{pending ? "Aguarde..." : mode === "sign-in" ? "Entrar" : "Criar conta"}</button></form><div className="mt-5 flex justify-between text-sm"><Link className="text-[var(--accent)]" href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>{mode === "sign-in" ? "Criar uma conta" : "Já tenho conta"}</Link>{mode === "sign-in" && <Link className="text-[var(--accent)]" href="/forgot-password">Esqueci a senha</Link>}</div></div>;
}

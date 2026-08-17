import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function SignUpPage() { return <main className="auth-canvas"><aside className="auth-aside"><Link href="/sign-in" className="brand">ritmo<span className="brand-mark">.</span></Link><div><h1>Faça espaço para o que importa.</h1><p>Comece com uma visão simples do seu dia e construa consistência sem transformar tudo em cobrança.</p></div><span className="help-text">Seu planejamento fica só seu.</span></aside><section className="auth-main"><AuthForm mode="sign-up" /></section></main>; }

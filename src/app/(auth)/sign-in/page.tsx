import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function SignInPage() { return <main className="auth-canvas"><aside className="auth-aside"><Link href="/sign-in" className="brand">ritmo<span className="brand-mark">.</span></Link><div><h1>Um plano claro para o dia real.</h1><p>Organize suas prioridades, acompanhe o foco e aprenda com o seu próprio ritmo.</p></div><span className="help-text">Planejamento pessoal, sem ruído.</span></aside><section className="auth-main"><AuthForm mode="sign-in" /></section></main>; }

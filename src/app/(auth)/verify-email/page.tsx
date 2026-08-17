import Link from "next/link";
import { VerifyEmailForm } from "@/components/verify-email-form";

export default function VerifyEmailPage() { return <main className="flex min-h-screen items-center justify-center bg-[var(--dark)] p-5"><div className="panel max-w-md p-8 md:p-10"><Link href="/sign-in" className="brand-mark">ritmo<span>.</span></Link><h1 className="mt-10 text-4xl">Confirme seu email</h1><p className="mt-3 muted">Envie um código de confirmação para seu email e informe-o abaixo. Se não encontrar a mensagem, confira o spam.</p><VerifyEmailForm /><Link className="btn btn-secondary mt-3 inline-block" href="/sign-in">Voltar para entrar</Link></div></main>; }

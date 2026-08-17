import Link from "next/link";
import { VerifyEmailForm } from "@/components/verify-email-form";

export default function VerifyEmailPage() { return <main className="flex min-h-screen items-center justify-center p-5"><div className="panel max-w-md p-7"><h1 className="text-2xl font-black">Confirme seu email</h1><p className="mt-2 muted">Envie um código de confirmação para seu email e informe-o abaixo. Se não encontrar a mensagem, confira o spam.</p><VerifyEmailForm /><Link className="btn btn-secondary mt-3 inline-block" href="/sign-in">Voltar para entrar</Link></div></main>; }

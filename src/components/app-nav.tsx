"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
const links = [{ href: "/day", label: "Meu dia" }, { href: "/routines", label: "Rotinas" }, { href: "/reports", label: "Relatórios" }, { href: "/settings", label: "Configurações" }];
export function AppNav() { const pathname = usePathname(); const router = useRouter(); const { data } = authClient.useSession(); const signOut = async () => { await authClient.signOut(); router.replace("/sign-in"); }; return <header className="app-header"><div className="container app-header-inner"><Link href="/day" className="brand">ritmo<span className="brand-mark">.</span></Link><nav className="main-nav" aria-label="Navegação principal">{links.map((link) => <Link key={link.href} href={link.href as never} className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""}`}>{link.label}</Link>)}</nav><div className="user-actions"><span className="user-name">{data?.user?.name ?? data?.user?.email}</span><button className="btn btn-quiet" onClick={signOut}>Sair</button></div></div></header>; }

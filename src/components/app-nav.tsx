"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";

const links = [{ href: "/day", label: "Meu dia" }, { href: "/routines", label: "Rotinas" }, { href: "/reports", label: "Relatórios" }, { href: "/settings", label: "Configurações" }];

export function AppNav() {
  const pathname = usePathname();
  const { data } = authClient.useSession();
  return <header className="border-b border-[var(--line)] bg-white/80"><div className="container flex min-h-18 items-center justify-between gap-5"><Link href="/day" className="text-lg font-black tracking-tight text-[var(--ink)]">ritmo<span className="text-[var(--accent)]">.</span></Link><nav className="hidden gap-5 sm:flex">{links.map((link) => <Link key={link.href} href={link.href as never} className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""}`}>{link.label}</Link>)}</nav><div className="flex items-center gap-3"><span className="hidden text-sm text-[var(--muted)] md:inline">{data?.user?.name ?? data?.user?.email}</span><button className="btn btn-quiet text-sm" onClick={() => authClient.signOut()}>Sair</button></div></div></header>;
}

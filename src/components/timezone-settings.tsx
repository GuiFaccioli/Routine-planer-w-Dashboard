"use client";

import { useState } from "react";
import { updateTimeZone } from "@/app/actions/daily-tasks";
import { detectBrowserTimeZone } from "@/lib/domain/timezone";

export function TimezoneSettings({ current }: { current: string }) {
  const [value, setValue] = useState(current); const [message, setMessage] = useState("");
  async function save() { await updateTimeZone(value); setMessage("Fuso horário salvo."); }
  return <div className="panel grid gap-4 p-6"><div><h2 className="text-xl font-black">Fuso horário</h2><p className="mt-1 text-sm muted">Detectado inicialmente pelo navegador. O valor salvo controla seus dias e relatórios.</p></div><div className="flex flex-wrap gap-2"><select className="input max-w-md" value={value} onChange={(event) => setValue(event.target.value)}><option value={value}>{value}</option><option value="America/Sao_Paulo">America/Sao_Paulo</option><option value="America/New_York">America/New_York</option><option value="Europe/Lisbon">Europe/Lisbon</option></select><button className="btn btn-secondary" onClick={() => setValue(detectBrowserTimeZone())}>Detectar novamente</button><button className="btn btn-primary" onClick={save}>Salvar</button></div>{message && <p className="text-sm text-[var(--accent)]">{message}</p>}</div>;
}

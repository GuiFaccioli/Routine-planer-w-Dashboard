"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTemplate } from "@/app/actions/templates";

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function TemplateForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { setPending(true); setError(""); try { await createTemplate({ title: String(formData.get("title")), category: String(formData.get("category")), defaultStartTime: String(formData.get("defaultStartTime")), defaultDurationMinutes: Number(formData.get("defaultDurationMinutes")), daysOfWeek: formData.getAll("daysOfWeek").map(Number) }); router.refresh(); (document.querySelector("form") as HTMLFormElement)?.reset(); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível criar a rotina."); } finally { setPending(false); } }
  return <form action={submit} className="panel grid gap-4 p-6"><div><h2 className="text-xl font-black">Nova rotina</h2><p className="mt-1 text-sm muted">Cadastre uma vez e deixe o dia nascer organizado.</p></div><label className="grid gap-1 text-sm font-bold">Nome<input className="input" name="title" placeholder="Faculdade" required /></label><label className="grid gap-1 text-sm font-bold">Categoria<input className="input" name="category" placeholder="Estudo" required /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-bold">Horário<input className="input" name="defaultStartTime" type="time" required /></label><label className="grid gap-1 text-sm font-bold">Duração (min)<input className="input" name="defaultDurationMinutes" type="number" min="1" step="1" defaultValue="60" required /></label></div><fieldset><legend className="mb-2 text-sm font-bold">Dias da semana</legend><div className="flex flex-wrap gap-2">{weekdays.map((day, index) => <label key={day} className="flex items-center gap-1 text-sm"><input name="daysOfWeek" type="checkbox" value={index} />{day}</label>)}</div></fieldset>{error && <p className="text-sm text-red-700">{error}</p>}<button className="btn btn-primary" disabled={pending}>{pending ? "Salvando..." : "Criar rotina"}</button></form>;
}

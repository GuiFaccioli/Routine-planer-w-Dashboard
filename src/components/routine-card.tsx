"use client";

import { useState } from "react";
import { TemplateForm } from "./template-form";

type Routine = { id: string; title: string; category: string; defaultStartTime: string; defaultDurationMinutes: number; isActive: boolean; daysOfWeek: number[] };

export function RoutineCard({ template }: { template: Routine }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <TemplateForm template={template} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />;
  return <article className="panel flex items-center justify-between gap-4 p-5"><div><h2 className="font-black">{template.title}</h2><p className="mt-1 text-sm muted">{template.category} · {template.defaultStartTime.slice(0, 5)} · {template.defaultDurationMinutes} min</p></div><div className="flex shrink-0 gap-2"><button className="btn btn-quiet text-sm" onClick={() => setEditing(true)}>Editar</button></div></article>;
}

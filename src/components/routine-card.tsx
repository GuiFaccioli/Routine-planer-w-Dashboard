"use client";

import { useState } from "react";
import { TemplateForm } from "./template-form";

type Routine = { id: string; title: string; category: string; defaultStartTime: string; defaultDurationMinutes: number; isActive: boolean; daysOfWeek: number[] };

export function RoutineCard({ template }: { template: Routine }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <TemplateForm template={template} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />;
  return <article className="panel routine-item"><div><h2 className="task-title">{template.title}</h2><p className="task-meta">{template.category} · {template.defaultStartTime.slice(0, 5)} · {template.defaultDurationMinutes} min</p></div><div className="routine-actions"><button className="btn btn-quiet" onClick={() => setEditing(true)}>Editar</button></div></article>;
}

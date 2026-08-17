import { archiveTemplate, listTemplates, restoreTemplate } from "@/app/actions/templates";
import { AppShell } from "@/components/app-shell";
import { RoutineCard } from "@/components/routine-card";
import { TemplateForm } from "@/components/template-form";

export const dynamic = "force-dynamic";

export default async function RoutinesPage() {
  const templates = await listTemplates();
  return <AppShell><div className="container grid gap-10 py-10 lg:grid-cols-[1fr_380px]"><section><p className="mb-3 text-sm font-semibold uppercase tracking-[.16em] text-[var(--accent)]">rotinas</p><h1 className="text-4xl md:text-6xl">Padrões que ajudam</h1><p className="mt-3 max-w-xl muted">Rotinas arquivadas não geram novas tarefas, mas nunca apagam seu histórico.</p><div className="mt-10 grid gap-4">{templates.length ? templates.map((template) => <div key={template.id}><RoutineCard template={template} />{template.isActive ? <form className="mt-2" action={archiveTemplate.bind(null, template.id)}><button className="btn btn-quiet text-sm">Arquivar rotina</button></form> : <form className="mt-2" action={restoreTemplate.bind(null, template.id)}><button className="btn btn-secondary text-sm">Restaurar rotina</button></form>}</div>) : <div className="panel p-8 text-center muted">Nenhuma rotina cadastrada.</div>}</div></section><TemplateForm /></div></AppShell>;
}

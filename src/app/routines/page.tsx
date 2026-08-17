import { archiveTemplate, listTemplates, restoreTemplate } from "@/app/actions/templates";
import { AppShell } from "@/components/app-shell";
import { RoutineCard } from "@/components/routine-card";
import { TemplateForm } from "@/components/template-form";

export const dynamic = "force-dynamic";

export default async function RoutinesPage() {
  const templates = await listTemplates();
  return <AppShell><div className="container page"><div className="routine-layout"><section><p className="eyebrow">Rotinas</p><h1 className="page-title">Padrões que ajudam</h1><p className="page-intro">Rotinas arquivadas não geram novas tarefas, mas nunca apagam seu histórico.</p><div className="routine-list">{templates.length ? templates.map((template) => <div key={template.id}><RoutineCard template={template} /><div className="mt-1">{template.isActive ? <form action={archiveTemplate.bind(null, template.id)}><button className="btn btn-quiet">Arquivar</button></form> : <form action={restoreTemplate.bind(null, template.id)}><button className="btn btn-secondary">Restaurar rotina</button></form>}</div></div>) : <div className="panel empty-state"><h2>Nenhuma rotina cadastrada</h2><p>Comece pela rotina que mais organiza a sua semana.</p></div>}</div></section><TemplateForm /></div></div></AppShell>;
}

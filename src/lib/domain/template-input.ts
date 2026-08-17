import { z } from "zod";

export const templateInput = z.object({
  title: z.string().trim().min(1, "Informe um nome para a rotina."),
  category: z.string().trim().min(1, "Informe uma categoria."),
  defaultStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Informe um horário válido."),
  defaultDurationMinutes: z.coerce.number().int().positive("A duração deve ser maior que zero."),
  daysOfWeek: z.array(z.coerce.number().int().min(0).max(6)).min(1, "Escolha pelo menos um dia."),
});

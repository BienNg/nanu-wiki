import 'server-only';
import { meta } from './providers/meta';
export type Template = { name: string; language: string; body: string; variables: string[] };
export async function templates(token: string, waba: string): Promise<Template[]> {
  if (!waba) return [];
  const rows: Template[] = [];
  let after = '';
  for (let page = 0; page < 20; page++) {
    const data = await meta(`${encodeURIComponent(waba)}/message_templates?fields=name,language,status,components&limit=100${after ? `&after=${encodeURIComponent(after)}` : ''}`, token);
    for (const t of data.data || []) {
      if (t.status !== 'APPROVED') continue;
      // Start with plain body templates; unsupported headers/buttons must not be silently omitted.
      if (!Array.isArray(t.components) || t.components.some((c: {type: string}) => !['BODY','FOOTER'].includes(c.type))) continue;
      const body = t.components.find((c: {type: string}) => c.type === 'BODY')?.text || '';
      const variables = [...new Set<string>([...body.matchAll(/\{\{([^}]+)\}\}/g)].map((m: RegExpMatchArray) => m[1]))];
      if (variables.some(v => !/^\d+$/.test(v))) continue;
      rows.push({ name: t.name, language: t.language, body, variables: variables.sort((a,b) => +a - +b) });
    }
    if (!data.paging?.next || !data.paging?.cursors?.after) break;
    after = data.paging.cursors.after;
  }
  return rows;
}

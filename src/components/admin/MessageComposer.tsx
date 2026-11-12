'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/Bi';
import { replyWindow } from '@/lib/messenger/policy';
import { createClient } from '@/lib/supabase/client';
import type { Template } from '@/lib/messenger/templates';
export type Outgoing = { id: string; status: string; sender_name: string; provider_message_id: string | null; created_at: string; error: string | null; payload: { text?: string; displayText?: string } };
export function MessageComposer({ conversation, channel, enabled, lastInbound, attempts }: { conversation: string; channel: string; enabled: boolean; lastInbound: string | null; attempts: Outgoing[] }) {
  const router = useRouter();
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now()); const [catalog, setCatalog] = useState<Template[]>([]); const [choice, setChoice] = useState(''); const [values, setValues] = useState<string[]>([]); const [consent, setConsent] = useState(false);
  const [upload, setUpload] = useState<{id: string; name: string} | null>(null);
  const pending = useRef<{ id: string; payload: object } | null>(null);
  const [connection, setConnection] = useState('');
  const [uncertain, setUncertain] = useState(false);
  const key = `inbox-draft:${conversation}`;
  useEffect(() => { try { setText(sessionStorage.getItem(key) || ''); } catch {} }, [key]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const db = createClient();
    const live = db.channel(`outbox:${conversation}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messenger_outbox', filter: `conversation_id=eq.${conversation}` }, () => router.refresh()).subscribe();
    return () => { clearInterval(timer); void db.removeChannel(live); };
  }, [conversation, router]);
  const window = replyWindow(lastInbound, now);
  const template = catalog.find(t => `${t.name}:${t.language}` === choice);
  const unresolved = attempts.some(a => ['sending','unknown'].includes(a.status));
  async function loadTemplates() {
    try { const r = await fetch(`/api/messenger/templates?conversation=${encodeURIComponent(conversation)}`); const d = await r.json(); if (!r.ok) throw new Error(); setCatalog(d.templates); if (!d.templates.length) setError('Keine Textvorlagen verfügbar · Không có mẫu văn bản khả dụng'); }
    catch { setError('Vorlagen nicht verfügbar · Không tải được mẫu'); }
  }
  async function send() {
    if (busy) return;
    setBusy(true); setError('');
    const request = pending.current || { id: crypto.randomUUID(), payload: { conversation, ...(template ? { template: { name: template.name, language: template.language, values, consent } } : { text, ...(upload ? { upload: upload.id } : {}) }) } };
    pending.current = request;
    try {
      const res = await fetch('/api/messenger/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: request.id, ...request.payload }) });
      const data = await res.json();
      if (!res.ok) { pending.current = null; throw new Error(data.error); }
      setUncertain(['unknown','sending'].includes(data.status));
      if (['sent','delivered','read'].includes(data.status)) {
        // Show the bubble at once; the server refresh replaces it with the stored message.
        globalThis.dispatchEvent(new CustomEvent('inbox:sent', { detail: { conversation, id: data.messageId || request.id, text: text || null, attachment: upload?.name || null, created_time: new Date().toISOString() } }));
        setText(''); setUpload(null); setChoice(''); sessionStorage.removeItem(key); pending.current = null; }
      if (data.status === 'failed') { pending.current = null; setError('Nicht gesendet. Entwurf prüfen und erneut senden. · Gửi thất bại. Kiểm tra và gửi lại.'); }
      router.refresh();
    } catch(e) {
      if (pending.current) setUncertain(true);
      setError(e instanceof Error && e.message === 'window' ? 'Antwortzeit abgelaufen. Vorlage wählen. · Hết thời gian trả lời. Chọn mẫu.' : 'Senden nicht bestätigt. Verbindung und Status prüfen. · Chưa xác nhận gửi. Kiểm tra kết nối và trạng thái.');
    } finally { setBusy(false); }
  }
  return <div className="border-t border-line bg-white p-3 space-y-2">
    <button className="text-xs text-accent underline" onClick={async () => { try { const r=await fetch(`/api/messenger/connection?conversation=${encodeURIComponent(conversation)}`); const d=await r.json(); setConnection(d.reachable ? `API erreichbar · API kết nối được${d.lastSync ? ` · Sync: ${new Date(d.lastSync).toLocaleString()}` : ''}${d.syncError ? ' · Sync-Fehler / Lỗi đồng bộ' : ''}` : `Zugang prüfen · Kiểm tra quyền truy cập${d.reason ? ` (${d.reason})` : ''}`); } catch {setConnection('Verbindung fehlgeschlagen · Lỗi kết nối');} }}><Label de="Verbindung prüfen" vi="Kiểm tra kết nối" /></button>
    {connection && <p className="text-xs text-muted">{connection}</p>}
    <div className="text-xs text-muted"><Label de={!enabled ? 'Senden noch nicht aktiviert' : window.open ? `Freie Antwort: noch ${Math.ceil((window.expiresAt-now)/60000)} Min.` : channel === 'whatsapp' ? 'Antwortfenster geschlossen · Vorlage erforderlich' : 'Antwortfenster geschlossen · keine freie Antwort möglich'} vi={!enabled ? 'Chưa bật gửi tin' : window.open ? `Có thể trả lời trong ${Math.ceil((window.expiresAt-now)/60000)} phút nữa` : 'Hết thời gian trả lời tự do'} /></div>
    {attempts.slice(-5).map(a => <div key={a.id} className="rounded bg-chip px-2 py-1 text-xs"><span>{a.sender_name} · <Label de={({sending:'Wird gesendet',sent:'Gesendet',delivered:'Zugestellt',read:'Gelesen',failed:'Fehlgeschlagen',unknown:'Bestätigung ausstehend'} as Record<string,string>)[a.status] || a.status} vi={({sending:'Đang gửi',sent:'Đã gửi',delivered:'Đã nhận',read:'Đã đọc',failed:'Thất bại',unknown:'Chờ xác nhận'} as Record<string,string>)[a.status] || a.status} /> · {a.payload.displayText || a.payload.text || '📎'}</span>{a.error && <span> · {a.error}</span>}</div>)}
    {(uncertain || unresolved) && <p role="status" className="text-xs text-amber-800"><Label de="Sendebestätigung ausstehend. Nicht erneut als neue Nachricht senden." vi="Đang chờ xác nhận. Không gửi lại thành tin mới." /></p>}
    {channel === 'whatsapp' && <button type="button" onClick={loadTemplates} className="text-xs text-accent underline"><Label de="WhatsApp-Vorlagen laden" vi="Tải mẫu WhatsApp" /></button>}
    {!!catalog.length && <select aria-label="Vorlage / Mẫu" value={choice} onChange={e => { setChoice(e.target.value); setValues([]); setConsent(false); }} className="w-full rounded border border-line p-2 text-sm"><option value="">Freier Text / Văn bản tự do</option>{catalog.map(t => <option key={`${t.name}:${t.language}`} value={`${t.name}:${t.language}`}>{t.name} · {t.language}</option>)}</select>}
    {template ? <div className="space-y-2">{template.variables.map((v,i) => <input key={v} aria-label={`Variable ${v}`} placeholder={`{{${v}}}`} value={values[i] || ''} onChange={e => setValues(prev => { const n=[...prev]; n[i]=e.target.value; return n; })} className="w-full rounded border border-line p-2 text-sm" />)}<p className="whitespace-pre-wrap rounded bg-chip p-2 text-sm">{template.body.replace(/\{\{(\d+)\}\}/g, (m,n) => values[template.variables.indexOf(n)] || m)}</p><label className="flex gap-2 text-xs"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><Label de="Kunde hat diesen Nachrichten zugestimmt." vi="Khách đã đồng ý nhận loại tin nhắn này." /></label></div> : <textarea aria-label="Nachricht / Tin nhắn" value={text} disabled={busy || uncertain} onChange={e => { setText(e.target.value); try { sessionStorage.setItem(key,e.target.value); } catch {} }} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); if (enabled && window.open && !unresolved) void send(); } }} rows={3} maxLength={2000} placeholder="Nachricht schreiben … / Viết tin nhắn …" className="w-full resize-y rounded-xl border border-line p-3 text-sm" />}
    {upload && <p className="text-xs">📎 {upload.name} <button onClick={() => setUpload(null)}>×</button><br /><Label de="Datei separat senden; Text danach." vi="Gửi tệp riêng, sau đó gửi văn bản." /></p>}
    <div className="flex items-center justify-between gap-2">
      {!template && <label className="text-xs cursor-pointer">📎 JPG / PNG / PDF · ≤4 MB<input type="file" accept="image/jpeg,image/png,application/pdf" disabled={busy || uncertain} className="block max-w-[200px] text-xs" onChange={async e => { const file=e.target.files?.[0]; if(!file) return; setBusy(true); try { const form=new FormData(); form.set('file',file); const r=await fetch('/api/messenger/upload',{method:'POST',body:form}); if(!r.ok) throw new Error(); setUpload(await r.json()); } catch { setError('Upload fehlgeschlagen · Tải tệp thất bại'); } finally {setBusy(false);} }} /></label>}
      <button onClick={send} disabled={busy || !enabled || (unresolved && !pending.current) || (!uncertain && (template ? !consent || template.variables.some((_,i) => !values[i]?.trim()) : !window.open || (!text.trim() && !upload) || (!!text.trim() && !!upload)))} className="rounded-full bg-accent px-5 py-2 text-sm text-white disabled:opacity-40"><Label de={busy ? 'Wird gesendet …' : uncertain ? 'Status prüfen' : 'Senden'} vi={busy ? 'Đang gửi …' : uncertain ? 'Kiểm tra trạng thái' : 'Gửi'} /></button>
    </div><div className="text-[10px] text-faint">Ctrl / ⌘ + Enter</div>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>;
}

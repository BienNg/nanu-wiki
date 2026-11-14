'use client';
import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/Bi';
import { checkInbox } from '@/components/admin/InboxLive';
import { replyWindow } from '@/lib/messenger/policy';
import { createClient } from '@/lib/supabase/client';
import type { Template } from '@/lib/messenger/templates';
export type Outgoing = { id: string; status: string; sender_name: string; provider_message_id: string | null; created_at: string; error: string | null; payload: { text?: string; displayText?: string } };
export function MessageComposer({ conversation, channel, enabled, lastInbound, attempts }: { conversation: string; channel: string; enabled: boolean; lastInbound: string | null; attempts: Outgoing[] }) {
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
    const live = db.channel(`outbox:${conversation}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messenger_outbox', filter: `conversation_id=eq.${conversation}` }, () => checkInbox()).subscribe();
    return () => { clearInterval(timer); void db.removeChannel(live); };
  }, [conversation]);
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
      // The chat and the list load again only if the send changed something.
      checkInbox();
    } catch(e) {
      if (pending.current) setUncertain(true);
      setError(e instanceof Error && e.message === 'window' ? 'Antwortzeit abgelaufen. Vorlage wählen. · Hết thời gian trả lời. Chọn mẫu.' : 'Senden nicht bestätigt. Verbindung und Status prüfen. · Chưa xác nhận gửi. Kiểm tra kết nối và trạng thái.');
    } finally { setBusy(false); }
  }
  async function checkConnection() {
    try { const r=await fetch(`/api/messenger/connection?conversation=${encodeURIComponent(conversation)}`); const d=await r.json(); setConnection(d.reachable ? `API erreichbar · API kết nối được${d.lastSync ? ` · Sync: ${new Date(d.lastSync).toLocaleString()}` : ''}${d.syncError ? ' · Sync-Fehler / Lỗi đồng bộ' : ''}` : `Zugang prüfen · Kiểm tra quyền truy cập${d.reason ? ` (${d.reason})` : ''}`); }
    catch { setConnection('Verbindung fehlgeschlagen · Lỗi kết nối'); }
  }
  const checkButton = <button type="button" className="flex-none text-xs font-medium text-accent hover:underline" onClick={checkConnection}><Label de="Verbindung prüfen" vi="Kiểm tra kết nối" /></button>;
  const minutes = Math.ceil((window.expiresAt-now)/60000);
  return <div className="border-t border-line bg-white p-3 space-y-2">
    {attempts.slice(-5).map(a => <div key={a.id} className="rounded bg-chip px-2 py-1 text-xs"><span>{a.sender_name} · <Label de={({sending:'Wird gesendet',sent:'Gesendet',delivered:'Zugestellt',read:'Gelesen',failed:'Fehlgeschlagen',unknown:'Bestätigung ausstehend'} as Record<string,string>)[a.status] || a.status} vi={({sending:'Đang gửi',sent:'Đã gửi',delivered:'Đã nhận',read:'Đã đọc',failed:'Thất bại',unknown:'Chờ xác nhận'} as Record<string,string>)[a.status] || a.status} /> · {a.payload.displayText || a.payload.text || '📎'}</span>{a.error && <span> · {a.error}</span>}</div>)}
    {(uncertain || unresolved) && <p role="status" className="text-xs text-amber-800"><Label de="Sendebestätigung ausstehend. Nicht erneut als neue Nachricht senden." vi="Đang chờ xác nhận. Không gửi lại thành tin mới." /></p>}
    {!enabled ? (
      // Sending is switched off for this channel: say so once instead of showing a composer that cannot send.
      <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-chip px-3.5 py-2.5 text-[13px] text-body">
        <span className="min-w-0 flex-1"><Label de={channel === 'whatsapp' ? 'Senden ist hier noch nicht aktiviert. Bitte in der WhatsApp Business App antworten.' : 'Senden ist hier noch nicht aktiviert. Bitte in der Business Suite antworten.'} vi={channel === 'whatsapp' ? 'Chưa bật gửi tin ở đây. Hãy trả lời trong WhatsApp Business.' : 'Chưa bật gửi tin ở đây. Hãy trả lời trong Business Suite.'} /></span>
        {checkButton}
      </div>
    ) : <>
      {!!catalog.length && <select aria-label="Vorlage / Mẫu" value={choice} onChange={e => { setChoice(e.target.value); setValues([]); setConsent(false); }} className="w-full rounded border border-line p-2 text-sm"><option value="">Freier Text / Văn bản tự do</option>{catalog.map(t => <option key={`${t.name}:${t.language}`} value={`${t.name}:${t.language}`}>{t.name} · {t.language}</option>)}</select>}
      {template ? <div className="space-y-2">{template.variables.map((v,i) => <input key={v} aria-label={`Variable ${v}`} placeholder={`{{${v}}}`} value={values[i] || ''} onChange={e => setValues(prev => { const n=[...prev]; n[i]=e.target.value; return n; })} className="w-full rounded border border-line p-2 text-sm" />)}<p className="whitespace-pre-wrap rounded bg-chip p-2 text-sm">{template.body.replace(/\{\{(\d+)\}\}/g, (m,n) => values[template.variables.indexOf(n)] || m)}</p><label className="flex gap-2 text-xs"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><Label de="Kunde hat diesen Nachrichten zugestimmt." vi="Khách đã đồng ý nhận loại tin nhắn này." /></label></div> : <textarea aria-label="Nachricht / Tin nhắn" value={text} disabled={busy || uncertain} onChange={e => { setText(e.target.value); try { sessionStorage.setItem(key,e.target.value); } catch {} }} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); if (window.open && !unresolved) void send(); } }} rows={3} maxLength={2000} placeholder="Nachricht schreiben … / Viết tin nhắn …" className="w-full resize-y rounded-xl border border-line p-3 text-sm" />}
      {upload && <p className="text-xs">📎 {upload.name} <button onClick={() => setUpload(null)}>×</button><br /><Label de="Datei separat senden; Text danach." vi="Gửi tệp riêng, sau đó gửi văn bản." /></p>}
      <div className="flex items-center gap-2">
        {!template && <label title="Datei anhängen · JPG / PNG / PDF · ≤4 MB" className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[15px] hover:bg-hover ${busy || uncertain ? 'opacity-40' : 'cursor-pointer'}`}>📎<input type="file" aria-label="Datei anhängen / Đính kèm tệp" accept="image/jpeg,image/png,application/pdf" disabled={busy || uncertain} className="sr-only" onChange={async e => { const file=e.target.files?.[0]; if(!file) return; setBusy(true); try { const form=new FormData(); form.set('file',file); const r=await fetch('/api/messenger/upload',{method:'POST',body:form}); if(!r.ok) throw new Error(); setUpload(await r.json()); } catch { setError('Upload fehlgeschlagen · Tải tệp thất bại'); } finally {setBusy(false);} }} /></label>}
        {channel === 'whatsapp' && !catalog.length && <button type="button" onClick={loadTemplates} className="h-8 flex-none rounded-full border border-line px-3 text-xs text-body hover:bg-hover"><Label de="Vorlagen" vi="Mẫu tin" /></button>}
        <span className="min-w-0 flex-1 truncate text-xs text-muted"><Label de={window.open ? `Freie Antwort: noch ${minutes} Min.` : channel === 'whatsapp' ? 'Antwortfenster geschlossen · Vorlage erforderlich' : 'Antwortfenster geschlossen · keine freie Antwort möglich'} vi={window.open ? `Có thể trả lời trong ${minutes} phút nữa` : 'Hết thời gian trả lời tự do'} /></span>
        <button onClick={send} title="Ctrl / ⌘ + Enter" disabled={busy || (unresolved && !pending.current) || (!uncertain && (template ? !consent || template.variables.some((_,i) => !values[i]?.trim()) : !window.open || (!text.trim() && !upload) || (!!text.trim() && !!upload)))} className="flex-none rounded-full bg-accent px-5 py-2 text-sm text-white disabled:opacity-40"><Label de={busy ? 'Wird gesendet …' : uncertain ? 'Status prüfen' : 'Senden'} vi={busy ? 'Đang gửi …' : uncertain ? 'Kiểm tra trạng thái' : 'Gửi'} /></button>
      </div>
    </>}
    {connection && <p className="text-xs text-muted">{connection}</p>}
    {error && <p role="alert" className="flex flex-wrap items-center gap-x-3 text-xs text-red-700"><span>{error}</span>{enabled && checkButton}</p>}
  </div>;
}

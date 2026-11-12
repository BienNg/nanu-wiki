export function replyWindow(lastInbound: string | null, now = Date.now()) {
  const time = lastInbound ? Date.parse(lastInbound) : NaN;
  const expiresAt = Number.isFinite(time) ? time + 86_400_000 : 0;
  return { open: expiresAt > now && time <= now, expiresAt };
}
export function deliveryState(current: string, incoming: string) {
  if (incoming === 'read') return incoming;
  if (incoming === 'delivered' && current !== 'read') return incoming;
  if (incoming === 'sent' && ['sending', 'unknown'].includes(current)) return incoming;
  if (incoming === 'failed' && ['sending', 'unknown', 'sent'].includes(current)) return incoming;
  return current;
}

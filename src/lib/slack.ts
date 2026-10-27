import "server-only";

/** Minimal Slack Web API client (bot token). Failures are logged, never thrown,
 *  so a Slack outage can't break the wiki. */
async function slack<T>(method: string, body: Record<string, unknown>): Promise<T | null> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://slack.com/api/${method}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) {
      console.warn(`[slack] ${method} failed:`, json.error);
      return null;
    }
    return json as T;
  } catch (err) {
    console.warn(`[slack] ${method} error`, err);
    return null;
  }
}

async function lookupUserId(email: string) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return json.ok ? (json.user.id as string) : null;
  } catch {
    return null;
  }
}

/** Sends a direct message to the Slack user with this (Google) e-mail address. */
export async function dmByEmail(email: string, text: string, blocks?: unknown[]) {
  const userId = await lookupUserId(email);
  if (!userId) return false;
  const res = await slack("chat.postMessage", { channel: userId, text, blocks, unfurl_links: false });
  return Boolean(res);
}

export function siteUrl(path = "") {
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${path}`;
}

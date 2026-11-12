# Inbox sending

Implemented for admin users in `/admin/messenger`. Facebook/WhatsApp sending is disabled until explicitly enabled. No customer messages are sent by installation or builds.

## Activation

1. Apply `20261112090000_messenger_sending.sql` with the normal Supabase migration workflow. This adds the outbox, webhook event journal, private uploads and storage bucket, status RPC, and Realtime publication for outgoing attempts. Apply the migration **before** deploying the updated WhatsApp callback.
2. Configure `.env.example` settings in the deployment: Page token/ID, shared Meta app secret, Messenger verify token; WhatsApp token, allowed phone number IDs and owning business account ID. A per-number token in `messenger_accounts` is also supported. Template lookup currently uses the configured WABA for explicitly allowed numbers.
3. Configure Facebook callback `/api/messenger/webhook`, subscribing to messages, message echoes, deliveries and reads. Retain the existing conversation sync cron. Keep the WhatsApp callback `/api/whatsapp/webhook` and `messages` subscription for status callbacks.
4. Verify production access to each asset and messaging permission in Meta. The inbox connection check tests asset access only; it does not certify App Review or sending permission.
5. Enable `MESSENGER_SEND_ENABLED=true` and/or `WHATSAPP_SEND_ENABLED=true` after configuring the account. Use an explicitly designated test recipient for end-to-end sends.
6. Validate text, JPG/PNG/PDF, template, out-of-window rejection, and delivery callbacks. Check callbacks under duplicate and delayed delivery.

Set either flag false to stop that channel's outgoing messages while keeping reading available. Zalo remains read-only.

## Behavior and supported scope

- Free-form messages require a stored incoming customer message less than 24 hours old, rechecked on the server. No Human Agent exception is assumed.
- Admin-only API routes resolve the account and recipient from the database. Session, origin, ownership, input and feature-flag checks apply server-side.
- Text limit is conservatively 2,000 characters. One JPEG, PNG or PDF per message, up to 4 MiB. Send attachments separately from text. Content signatures are checked. Files stay in private storage; Meta receives a temporary signed URL.
- Approved WhatsApp BODY/FOOTER templates with numbered parameters are supported, with preview and explicit opt-in attestation stored in the payload. Media headers, buttons, named parameters and starting new conversations are not supported in this release.
- Draft text is stored per conversation in browser session storage. Attachments/template selections are not restored after reload.
- Each submission has a UUID and immutable payload hash. Repeat UUIDs return the original outcome and cannot create another send. Definitive failures allow a new submission; ambiguous outcomes never automatically retry.
- WhatsApp callbacks carry the outgoing UUID, allowing delivery reconciliation after a lost response. Facebook echoes correlate using message metadata. If callbacks never arrive, ambiguous sends require operator investigation against the native inbox; do not resend until verified. The webhook journal retains original events for investigation/replay.
- Recent outgoing status and sender attribution appear below the thread. Existing messages sent externally have no staff attribution. Supabase Realtime refreshes outgoing attempts; existing 30-second refresh and one-minute Facebook sync remain the fallback.
- Connection checks show API reachability and last sync, not a guarantee of sending eligibility.

## Checks

`node --test tests/messenger-*.test.cjs`
`npm run typecheck`
`npm run build`

Live credentials, SQL migration application and real message delivery must be verified in the deployment. The service-role key must remain server-only. Plan retention/cleanup of webhook payloads, old attempts and unused private uploads according to the team's customer-data retention policy.

## Setup progress (2026-11-12)

- Production migration applied through the signed-in Supabase SQL editor and registered as `20261112090000`; all three new tables verified through the REST API.
- Supabase Auth health check returned HTTP 200.
- Existing Facebook Page token is valid and includes `pages_messaging`, but Page metadata/subscription inspection is missing permissions.
- Known WhatsApp phone-number asset access returns Meta permission error 10 with the existing token. A suitably authorized WhatsApp token is still needed.
- Production already has `META_APP_SECRET` and `WHATSAPP_VERIFY_TOKEN`; neither was copied locally.
- Runtime pinned to Node 22 because installed Supabase libraries require native WebSocket support.

## Review fixes (2026-11-12, local only — not yet deployed)

- WhatsApp callback: if the event journal/status path fails, inbound messages are still saved (idempotent upserts) and the route returns 500 so Meta retries the status callbacks.
- Send: if marking `sent` fails after Meta accepted, the result is `unknown` (never retried automatically). The response returns the current DB status, which a quicker callback may already have moved to `delivered`/`read`.
- Facebook webhook: a full conversation sync runs only for inbound customer messages, not for every echo/delivery/read.
- Facebook read watermark: no longer marks `failed` attempts as read, and sets `updated_at`.
- Still open: an attempt left in `sending` because the function crashed between the outbox insert and the Meta call stays `sending`. Treat it as `unknown` and check the native inbox.

## Activation status (2026-11-12)

- Facebook: `MESSENGER_SEND_ENABLED=true`. Webhook verified and Page subscribed (messages, echoes, deliveries, reads). Tested against the owner's own account: 2 texts + 2 images, all reached `read`. Real customers need `pages_messaging` Advanced Access (App Review submitted separately).
- WhatsApp: `WHATSAPP_SEND_ENABLED=true` with a system-user token on WABA 468328243022012 / number 462459090282486. Tested against the owner's own number: text, PNG and PDF, all reached `delivered`.
- Not yet tested: WhatsApp templates (needs a payment method), out-of-window rejection, duplicate/late callbacks in production.
- Backfilled `account_id` on legacy Facebook conversations (`20261112120000_messenger_backfill_account.sql`, applied directly via REST, not registered in migration history).

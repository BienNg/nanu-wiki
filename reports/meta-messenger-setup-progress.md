# Facebook & WhatsApp sending: progress

Last updated: 2026-11-15. Pick up from the "Next steps" section.

## Already working

- `MESSENGER_SEND_ENABLED=true` in Vercel Production.
- `messenger_outbox` table exists in Supabase.
- Meta Page webhook is active: `https://nanu-wiki.vercel.app/api/messenger/webhook` (messages, message_deliveries, message_reads).
- WhatsApp webhook is active: `https://nanu-wiki.vercel.app/api/whatsapp/webhook`.
- Page access token is valid, never expires, and includes `pages_messaging`.
- `META_APP_SECRET` is set in `.env.local`.
- Business verification: **Verified** (NANU NANA - DU HỌC ĐỨC).

## Why sending fails for customers

A test send to a customer gets **Meta error 10**. The app is in Live mode but `pages_messaging` is only "Ready for testing", so only people with a role on the app (admin, developer, tester) can receive messages. Fix: App Review for Advanced Access.

## App Review submission status

Go to: developers.facebook.com → NaNu Wiki Inbox → **App Review**.

| Step | Status |
|---|---|
| Verification | Done |
| App settings (icon, privacy URL, category, contact email) | Done. Still check **App settings → Basic → Data deletion instructions URL** is filled in. |
| Allowed usage | In progress (see below) |
| Data handling | Not started |
| Reviewer instructions | Not started |

### Permissions on the list

- `whatsapp_business_messaging`: description drafted, recording **not uploaded yet**, agreement ticked. Needs a WhatsApp recording: customer message, staff reply, reply on the phone.
- `pages_messaging`: description done, step-by-step test instructions drafted, recording **not uploaded yet**, agreement ticked. Needs a Messenger recording from a tester account.
- `whatsapp_business_management`: description drafted (below), recording not made. Recording should show the template picker in the inbox.
- `business_management`: still on the list, no description yet. Undecided. The app doesn't use it, so removing it is recommended.
- `pages_manage_metadata`: removed (webhooks already set up).
- `pages_show_list`: removed by you. Note: Meta requires `pages_show_list` only when `pages_manage_metadata` is included, which it no longer is.
- `public_profile`: default, leave it.

### Drafted descriptions

**pages_messaging:**
> NaNu NaNa uses pages_messaging for its Facebook Page inbox. People who message the Page are prospective students asking about study programmes in Germany. Our staff read these conversations in an internal inbox and reply through the Messenger Send API. Replies are text or file attachments, such as course information. The app only sends replies inside the standard 24-hour window after the customer's last message. It reads conversations so staff can see the history. We don't use this permission for advertising or to contact people who haven't written to us.

**whatsapp_business_management:**
> NaNu NaNa uses whatsapp_business_management to read its WhatsApp Business Account details and load the message templates it has approved with Meta. When a customer hasn't written in the last 24 hours, staff choose an approved template in the inbox. The app doesn't create, edit or delete templates or change account settings.

**whatsapp_business_messaging:** saved draft describes staff replying to prospective students' WhatsApp messages from the inbox via the WhatsApp Cloud API, with templates outside the 24-hour window.

### Test instructions for pages_messaging (reviewer section)

Steps: reviewer logs in to Facebook with the review account (a Tester on the app) → messages the NaNu NaNa Page → logs in to https://nanu-wiki.vercel.app/admin/messenger with the reviewer login → opens the conversation → sends a reply → checks the reply appears in Messenger.

## Blockers

1. **Screen recording upload fails** ("Something Went Wrong" on the upload). The file is 26 MB. Try: re-export as MP4 (H.264), try another browser, refresh, retry later.
2. **Review Facebook account not set up yet.** Create a new Facebook account (not your personal one), add it under **App roles → Roles → Add people → Tester**, and have it accept the invite. Its login goes only in the Reviewer instructions section of the form.

## Next steps (in order)

1. Make the screen recordings (Messenger and WhatsApp) and upload them.
2. Create the review Facebook account and make it a Tester.
3. Decide on `business_management` (recommended: remove).
4. Finish Allowed usage for each remaining permission, then Save.
5. Data handling: answer the data questions. Keep answers consistent with the privacy policy at https://www.nanunana-tiengduc.com/chinh-sach-bao-mat.
6. Reviewer instructions: add the test steps, the review account login, and the inbox URL.
7. Confirm the data deletion URL under App settings → Basic.
8. Click **Submit for review**. This is final. Meta can't be asked to cancel it.

## Decisions still open

- Whether a Tech Provider is needed. The popup earlier said it was, but the App Review form now opens without asking for it. Check again if a prompt appears.
- Whether to keep `business_management`.

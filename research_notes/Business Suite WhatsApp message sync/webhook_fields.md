# WhatsApp webhook fields that deliver the content of OUTGOING business messages (state: mid-November 2026)

Research date: 2026-11-15. Meta's doc pages carry no "last updated" stamp; dates below are the dates I fetched them or dates printed in the source. Labels used: **[Meta docs]** = read on developers.facebook.com; **[Third party]** = BSP/vendor/forum; **[Inference]** = my reasoning, not stated by any source.

Short answer for the report writer: No Meta document says that messages typed in the Meta Business Suite inbox are delivered with content to a third-party app. `smb_message_echoes` is documented only for the WhatsApp Business app and linked companion devices. The only other documented content-carrying "echo" for WhatsApp is the newer `standby` field (`standby.message_echoes`), which is documented for "another responder on the number — such as Meta Business Agent", requires the business to grant "standby visibility", and is NOT documented to cover the Business Suite inbox. Whether it does is untested/unknown.

## 1. What exactly does `smb_message_echoes` cover? Is Meta Business Suite inbox covered or excluded?

### Takeaway
Meta's docs scope `smb_message_echoes` strictly to messages sent with the WhatsApp Business app or a supported companion ("linked") device. Meta Business Suite inbox is neither listed as covered nor explicitly excluded; it is simply never mentioned on either page.

### Cited Findings
- [Meta docs] Webhooks overview field table: `smb_message_echoes` covers messages sent via the WhatsApp Business app or a linked device by customers onboarded via a solution provider — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] Reference page wording (fragments as returned by the fetch): the webhook "notifies you of messages sent via the WhatsApp Business app or a" companion ("linked") device, by a business customer "who has been onboarded to Cloud API via a solution provider." Triggers: the customer "sends a message using the WhatsApp Business app or a companion device to a WhatsApp user or another business"; revokes a sent message using the WhatsApp Business app; edits a sent message using the WhatsApp Business app — [smb_message_echoes reference](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/smb_message_echoes)
- [Meta docs] Payload: `field: "smb_message_echoes"`, with the messages in a `value.message_echoes[]` array (`from`, `to`, `to_user_id`, `id`, `timestamp`, `type`, type object). Note: `message_echoes` here is the ARRAY name inside the payload, not a separate webhook field — [smb_message_echoes reference](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/smb_message_echoes)
- [Meta docs] Coexistence onboarding guide: subscription line reads "smb_message_echoes — describes any new messages your client sends with the WhatsApp Business app after onboarding"; trigger: "A business customer uses the WhatsApp Business app or supported companion device to message a WhatsApp user."; "Each time a business sends a message with one of these apps, it triggers an smb_message_echoes webhook" — [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Meta docs] "All companion clients are supported, except for WhatsApp for Windows and WhatsApp for WearOS." Messages involving unsupported companion clients do not trigger the webhooks — [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Meta docs] Neither the reference page nor the onboarding guide mentions Meta Business Suite or any inbox (confirmed by two separate fetches, 2026-11-15) — [smb_message_echoes reference](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/smb_message_echoes); [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Meta docs] "Messages sent from the WhatsApp Business app are not subject to the customer service window" and do not affect Cloud API pricing — [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Third party] 360dialog, Telnyx, Gupshup and Chakra describe the field the same way (Business app + linked devices only); Telnyx calls the echo non-billable and says it does not open/extend the customer service window — [360dialog coexistence webhooks](https://docs.360dialog.com/docs/waba-basics/phone-numbers/coexistence/coexistence-webhooks); [Telnyx coexistence webhooks](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence/webhooks); [Gupshup coexistence events](https://docs.gupshup.io/docs/coexistence-events-webhooks); [Chakra FAQ](https://chakrahq.com/help/chat/api-webhook-integration/wabhook-api-support-faqs)

### Inferences
- [Inference] The observed behaviour (Business Suite replies produce `statuses` with a `pricing` object, Business app replies produce echoes without pricing) fits the docs: Business app sends are outside Cloud API pricing, while Business Suite sends are billed like Cloud API sends. So Business Suite inbox is not acting as a WhatsApp "companion device" and is therefore outside `smb_message_echoes` by definition. Meta does not state this explicitly.

### Gaps
- No Meta sentence explicitly saying "Meta Business Suite inbox messages do not trigger smb_message_echoes". The exclusion is by omission plus observed behaviour.
- Meta doc pages have no last-updated date.

## 2. Is there a `message_echoes` webhook field for WhatsApp Cloud API that echoes sends by ANY app incl. Business Suite? Added 2025/2026? Full field list.

### Takeaway
No standalone WABA field named `message_echoes` is documented by Meta as of 2026-11-15 (the reference URL returns "page not found"; it is absent from the overview field table). What DID appear in 2026 is a `standby` field whose sub-object `standby.message_echoes` carries the content of messages sent by "another responder on the number", tied to Meta Business Agent / thread control and requiring a business-side grant. One vendor page claims a plain `message_echoes` field exists; that claim is unsourced and contradicted by another vendor.

### Cited Findings
- [Meta docs] Field table on the webhooks overview (20 fields as returned by the fetch): account_alerts, account_review_update, account_update, automatic_events, business_capability_update, calls, history, message_template_components_update, message_template_quality_update, message_template_status_update, messages, partner_solutions, payment_configuration_update, phone_number_name_update, phone_number_quality_update, security, smb_app_state_sync, smb_message_echoes, template_category_update, user_preferences. No `message_echoes` — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] `messages` field covers inbound user messages and "the status of messages sent by a business to a WhatsApp user" — i.e. status only for outbound — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] The URL `.../whatsapp/webhooks/reference/message_echoes.md` returns Meta's "Page Not Found" (fetched 2026-11-15) — [message_echoes.md (404)](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/message_echoes.md)
- [Meta docs] A `standby` webhook field exists for WhatsApp. It notifies an app "about conversation activity on a WhatsApp Business phone number when another responder owns the thread." Sub-objects: `standby.messages`, `standby.message_echoes`, `standby.statuses` — [Standby webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/standby/)
- [Meta docs] Echo trigger: "When another responder on the number — such as Meta Business Agent — sends an outbound message to a WhatsApp user, your app receives an 'echo' of that message." The echo carries "the send-time parameters exactly as passed to the Send Message API" (`id`, `timestamp`, `message`, optional `template`/`flow`) — [Standby webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/standby/)
- [Meta docs] Conditions: subscribe to `standby` under WhatsApp > Configuration > Webhook fields; "Subscribing alone is not enough — the business must also grant your app standby visibility." (in its routing configuration); "Standby is off by default." Not sent when your app owns the thread or when your own app sent the message — [Standby webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/standby/)
- [Meta docs] `standby.statuses` fires when "a message sent by another responder is sent, delivered, or read", with `pricing` fields — [Standby webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/standby/)
- [Meta docs] Meta Business Agent setup: "Meta Business Agent requires three webhook fields" — `messages`, `standby`, `messaging_handovers`; standby copies arrive when the app's routing configuration grants standby visibility; the Meta Business Agent tab "only appears if at least one phone number in your WABA is eligible." — [Meta Business Agent: End-to-end setup](https://developers.facebook.com/documentation/meta-business-agent/get-started)
- [Meta docs] The Messenger Platform has a real `message_echoes` webhook event; that is Messenger/Instagram, not WhatsApp — [Messenger message_echoes reference](https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks/webhook-events/message-echoes)
- [Meta docs] Changelog entries found for coexistence: Feb 11, 2025 "Added ability for solution providers to onboard WhatsApp Business app users via Embedded Signup (aka "Coexistence")."; May 29, 2025 (`coexistence` featureType replaced by `whatsapp_business_app_onboarding`); Oct 23, 2025 (more countries); Nov 25, 2025 "The following messages event webhooks are now supported for Coexistence in Embedded Signup:"; Jul 15, 2025 Multi-solution Conversations ("enables businesses to use multiple partners and solutions on the same phone number"). My fetch found no changelog entry naming `message_echoes`, `standby` or echo — [WhatsApp changelog](https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog)
- [Third party, unsourced, conflicting] Dualhook's doc table lists a field `message_echoes` = "Messages the business sent through the Cloud API," from any app or tool with access to the number, and says "Dualhook does not subscribe to `message_echoes`". The page cites no Meta URL and gives no subscription steps — [Dualhook smb_message_echoes page](https://dualhook.com/docs/webhook-smb-message-echoes); contradicted by Infiq glossary: "Messages sent through the API never echo — you already hold their wamid and follow them through the statuses webhook." — [Infiq glossary](https://www.infiq.in/glossary/message-echoes-webhook)
- [Third party] A community mirror of Meta's WhatsApp webhook reference lists no `message_echoes` or `standby` file (mirror may be stale; listing possibly truncated) — [kapso-meta-docs mirror](https://github.com/kapso-meta-docs/documentation/tree/main/documentation/whatsapp/webhooks/reference)

### Inferences
- [Inference] Dualhook's `message_echoes` row most likely describes `standby.message_echoes` loosely (or is an error). Treat a plain WABA-level `message_echoes` field as NOT confirmed. The cheapest hard check is to look at the app's own WhatsApp > Configuration > Webhook fields list in the App Dashboard, or `GET /{app-id}/subscriptions`, and see whether `standby`, `messaging_handovers` or `message_echoes` are offered.
- [Inference] The overview table returned by my fetch does not contain `standby` or `messaging_handovers`, although Meta's standby and Meta Business Agent pages document them. So the overview table is incomplete or lags; absence from that table is weak evidence.

### Gaps
- Exact introduction date of the `standby` field: not found. A search-engine summary attributed "Aug 3, 2026 addition of a Meta Business Agent section" to the changelog and "Updated September 4, 2026" to the Thread Control reference, but my two direct fetches of the changelog showed only May 12, 2026 entries for 2026 (the fetch may have been truncated). Unverified; conflict noted.
- I did not read Meta's Thread Control / Conversation Routing reference pages directly (tool budget).

## 3. How does Meta Business Suite inbox send WhatsApp messages technically, and why status-with-pricing but no content?

### Takeaway
Meta does not document the transport used by the Business Suite inbox. The observed pattern (statuses with pricing, no echo) is what the documented design predicts for any message sent through the platform by a sender other than your app: the `messages` field only ever carries status for outbound messages, never content.

### Cited Findings
- [Meta docs] Status webhooks are triggered when a message is sent/delivered/read; the payload has message ID, status, timestamp, recipient, pricing, errors, and no body field. `pricing` includes `pricing_model` (`PMP`), `type` (`regular` or a free type such as customer service window), `category` (service/utility/marketing) — [Status messages webhook reference](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/status)
- [Meta docs] The status page does not say whether statuses go only to the sending app or to every subscribed app, and does not mention other apps or Meta Business Suite — [Status messages webhook reference](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/status)
- [Meta docs] Business app messages "are not subject to the customer service window" and sit outside Cloud API pricing — [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Third party, weak] An n8n forum commenter states that Cloud API messages sent by an external tool do not show in the Meta Business Suite inbox and "Meta designed it that way" (the reverse direction; unverified, undated in my results) — [n8n community thread](https://community.n8n.io/t/whatsapp-bot-responses-not-appearing-in-meta-business-suite-inbox/206218)
- [Third party] Make forum (13 Mar 2026): for sent messages the `messages` webhook "does not include the message content"; `smb_message_echoes` is the only content source and only with Embedded Signup coexistence onboarding — [Make community thread](https://community.make.com/t/whatsapp-business-cloud-api-watch-sent-messages/105497)

### Inferences
- [Inference, moderately confident] Business Suite inbox sends through Meta's server-side platform path (Cloud-API-like, under a Meta-owned sender), not as a WhatsApp linked device. Evidence: the status events carry a Cloud API `pricing` object, which Business app/companion sends never have, and no `smb_message_echoes` fires.
- [Inference] Because the app receives those statuses at all, WABA-level status delivery is evidently not restricted to the app that sent the message. Content, however, has no carrier on the `messages` field.

### Gaps
- No Meta source describing the Business Suite inbox's WhatsApp transport or its identity as an "app"/"responder". This remains speculation.
- No source confirming whether Business Suite inbox counts as a "responder" under thread control, which decides whether `standby.message_echoes` would cover it.

## 4. With several apps on one WABA, does any app receive the content of messages SENT by another app?

### Takeaway
On the classic fields: no; outbound messages are represented only by status. The one documented exception is the `standby` field, which gives a passive app a copy of what another responder sent, but only after the business grants standby visibility, and it is documented around Meta Business Agent and multi-app thread control.

### Cited Findings
- [Meta docs] `messages` = inbound messages plus "the status of messages sent by a business to a WhatsApp user" — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] Multiple apps: "Meta sends retries to all apps that have subscribed to webhooks" for the account, which "can result in duplicate webhook notifications." — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] Webhook overrides: "You can use an alternate webhook endpoint for certain webhook fields" per WABA or phone number; it changes the destination URL, not which events exist — [Webhooks overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
- [Meta docs] Standby: the responders that can share a number are another app and Meta Business Agent; exactly one responder owns a thread; "Only the thread owner may send Service messages"; "Do not reply to the WhatsApp user in response to a standby webhook."; you do not get standby events for messages your own app sent — [Standby webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/standby/)
- [Meta docs] `messaging_handovers` "notifies you whenever control changes"; "Sending a message to a conversation takes control implicitly."; `take` is restricted to the configured escalation partner — [Meta Business Agent: End-to-end setup](https://developers.facebook.com/documentation/meta-business-agent/get-started)
- [Third party] 360dialog: "Meta delivers every agent reply to your app as an echo on standby.message_echoes"; and "Meta documents no BSP's inbox behavior, so ask your provider and test on an allowlisted number." (page cites sources accessed 21 Sep 2026) — [360dialog: BSP integration and Meta Business Agent](https://360dialog.com/blog/bsp-integration-meta-business-agent-whatsapp/)
- [Meta docs] Jul 15, 2025 changelog: Multi-solution Conversations "enables businesses to use multiple partners and solutions on the same phone number" — [WhatsApp changelog](https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog)

### Inferences
- [Inference] `standby` is the only documented mechanism that could, in principle, deliver Business Suite inbox content, IF Meta treats the inbox as "another responder" and IF the number is eligible for conversation routing. Neither is documented. It is worth one concrete test: subscribe the app to `standby` (and `messaging_handovers`) if the dashboard offers them, look for a routing/standby-visibility setting for the number in Business Suite, send a reply from the inbox, and watch for `field: "standby"`.
- [Inference] Risk to check before enabling: thread-control semantics mean a non-owner app's free-form sends can fail, so turning on routing could affect the app's own ability to send.

### Gaps
- Whether standby/routing is available for coexistence numbers, in which countries, and without enabling Meta Business Agent: not found.
- Where exactly the "standby visibility" grant lives in the UI: Meta's standby page says the business grants it in its routing configuration in Meta Business Suite; the setup guide defers to a "Prepare before enabling" guide I did not read.

## 5. Developer reports 2025-2026 on "Business Suite messages not appearing via webhook / coexistence" and solutions

### Takeaway
I found no public report describing exactly this symptom (Business Suite inbox reply -> status only, no content) and no published workaround. Reports and BSP help pages cover the neighbouring cases (Business app echoes, unsupported companion devices, missing subscription) only.

### Cited Findings
- [Third party] Make forum, 13-14 Mar and 1 Jun 2026: sent-message content is only available via `smb_message_echoes` with Embedded Signup coexistence; a later answer advises to "verify the exact onboarding path and webhook fields available to your account before promising CRM parity." Business Suite not mentioned — [Make community thread](https://community.make.com/t/whatsapp-business-cloud-api-watch-sent-messages/105497)
- [Third party] Make forum: its Coexistence "Watch Events" module reportedly does not expose `smb_message_echoes` (user report) — [Make community thread](https://community.make.com/t/whatsapp-coexistence-watch-events-does-not-expose-smb-message-echoes/114713)
- [Third party] respond.io help: messages sent from WhatsApp for Windows may appear in the Business app but not in respond.io on a coexistence number — [respond.io coexistence help](https://respond.io/help/whatsapp/whatsapp-coexistence)
- [Third party] Dualhook developer guide (states it was fact-checked against Meta docs on 30 Aug 2026): echoes come only from the Business app or a supported companion device; Meta Business Suite does not appear on the page — [Dualhook coexistence for developers](https://dualhook.com/whatsapp-coexistence-for-developers)
- [Third party] Telnyx consumes `history` and `smb_app_state_sync` internally and does not forward them; its WABA-level webhook does not receive the echo event (partner-specific behaviour) — [Telnyx coexistence webhooks](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence/webhooks)
- [Third party, weak] n8n forum: API-sent bot replies not shown in the Business Suite inbox, described by a commenter as by design — [n8n community thread](https://community.n8n.io/t/whatsapp-bot-responses-not-appearing-in-meta-business-suite-inbox/206218)

### Inferences
- [Inference] Practical options implied by the evidence, in order of certainty: (a) have staff reply from the WhatsApp Business app / WhatsApp Web / a supported linked device (documented to echo with content) or from the third-party app itself, not from the Business Suite inbox; (b) test the `standby` field as described in section 4 (undocumented for this case); (c) accept status-only and show a placeholder ("sent from Business Suite") keyed by the wamid in the status event.

### Gaps
- No Meta developer community forum thread, Stack Overflow question or GitHub issue (Chatwoot, Evolution API) on this exact symptom surfaced in my searches. Meta's community forum is poorly indexed, so absence of results is not proof nobody reported it.
- No BSP help article (360dialog, Twilio, Gupshup, Wati, respond.io, YCloud) was found that names Meta Business Suite inbox as a coexistence limitation.

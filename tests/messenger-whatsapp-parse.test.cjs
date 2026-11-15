const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/lib/messenger/whatsapp-parse.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const { parseWhatsAppWebhook, SENT_ELSEWHERE_MIME } = context.exports;

function body(status) {
  return {
    object: 'whatsapp_business_account',
    entry: [{ id: '1', changes: [{ field: 'messages', value: {
      messaging_product: 'whatsapp',
      metadata: { phone_number_id: '462', display_phone_number: '84862000000' },
      contacts: [{ wa_id: '4915500000000', user_id: 'DE.1' }],
      statuses: [{ id: 'wamid.X', timestamp: '1794568639', recipient_id: '4915500000000', recipient_user_id: 'DE.1', ...status }],
    } }] }],
  };
}

test('a sent receipt for a reply typed in Meta Business Suite becomes a stand-in reply', () => {
  const [batch] = parseWhatsAppWebhook(body({ status: 'sent' }));
  assert.equal(batch.messages.length, 0);
  assert.equal(batch.sentElsewhere.length, 1);
  const m = batch.sentElsewhere[0];
  assert.equal(m.id, 'wamid.X');
  assert.equal(m.fromPage, true);
  assert.equal(m.phone, '4915500000000');
  assert.equal(m.userId, 'DE.1');
  assert.equal(m.text, null);
  assert.equal(m.attachments[0].mime_type, SENT_ELSEWHERE_MIME);
  assert.equal(m.created_time, new Date(1794568639 * 1000).toISOString());
});

test('receipts for our own sends and late delivered/read receipts create nothing', () => {
  assert.equal(parseWhatsAppWebhook(body({ status: 'sent', biz_opaque_callback_data: '6f1c2a3e-0000-4000-8000-000000000000' })).length, 0);
  assert.equal(parseWhatsAppWebhook(body({ status: 'delivered' })).length, 0);
  assert.equal(parseWhatsAppWebhook(body({ status: 'read' })).length, 0);
  assert.equal(parseWhatsAppWebhook(body({ status: 'failed' })).length, 0);
});

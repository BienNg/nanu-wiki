const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/lib/messenger/reopen.ts','utf8');
const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{}}; vm.runInNewContext(code,context);
const {reopenLost}=context.exports;
const lost={outcome:'verloren',loss_reason:'preis',labeled_through:'2026-11-10T10:00:00Z',resume_on:null,pinned:['outcome','loss_reason','level']};
test('a Verloren person who writes again is reopened, other pins stay',()=>{
 const r=reopenLost(lost,{last_customer_at:'2026-11-12T08:00:00Z'});
 assert.equal(r.outcome,'offen');
 assert.equal(r.loss_reason,null);
 assert.deepEqual([...r.pinned],['level']);
});
test('no new message from the person keeps Verloren',()=>{
 assert.equal(reopenLost(lost,{last_customer_at:'2026-11-10T10:00:00Z'}),lost);
 assert.equal(reopenLost(lost,{last_customer_at:null}),lost);
});
test('other statuses are not touched',()=>{
 const zalo={...lost,outcome:'weiter_auf_zalo',loss_reason:null};
 assert.equal(reopenLost(zalo,{last_customer_at:'2026-11-12T08:00:00Z'}),zalo);
 assert.equal(reopenLost(undefined,{last_customer_at:'2026-11-12T08:00:00Z'}),undefined);
});

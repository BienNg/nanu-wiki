const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/lib/messenger/policy.ts','utf8');
const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{}}; vm.runInNewContext(code,context);
const {replyWindow,deliveryState}=context.exports;
test('free replies close at exactly 24h and cannot reopen from missing/future timestamps',()=>{
 const now=Date.parse('2026-11-12T12:00:00Z');
 assert.equal(replyWindow('2026-11-11T12:00:01Z',now).open,true);
 assert.equal(replyWindow('2026-11-11T12:00:00Z',now).open,false);
 for(const date of [null,'invalid','2026-11-13T12:00:00Z']) assert.equal(replyWindow(date,now).open,false);
});
test('late sent/failed notifications never regress delivered or read',()=>{
 for(const state of ['delivered','read']) for(const event of ['sent','failed']) assert.equal(deliveryState(state,event),state);
 assert.equal(deliveryState('unknown','delivered'),'delivered');
 assert.equal(deliveryState('read','delivered'),'read');
 assert.equal(deliveryState('sent','failed'),'failed');
});

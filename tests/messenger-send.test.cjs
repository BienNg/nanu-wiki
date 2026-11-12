const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
function setup(options={}) {
 const rows=new Map(); let sends=0;
 const db={from(table) {
  let operation='select', payload, filters=[];
  const q={select(){return q},eq(k,v){filters.push([k,v]);return q},gte(){return q},lt(){return q},in(){return q},order(){return q},limit(){return q},insert(p){operation='insert';payload=p;return q},update(p){operation='update';payload=p;return q},upsert(p){operation='upsert';payload=p;return q},single(){return run()},maybeSingle(){return run()},then(resolve,reject){return run().then(resolve,reject)}};
  async function run(){
   if(table==='messenger_outbox') {
    const id=filters.find(([k])=>k==='id')?.[1];
    if(operation==='insert'){ if(rows.has(payload.id)) return {error:{code:'23505'}}; rows.set(payload.id,{...payload,status:'sending'});return {}; }
    if(operation==='update'){Object.assign(rows.get(id),payload);return {};}
    return {data:id?rows.get(id)||null:null,count:0};
   }
   if(table==='messenger_conversations') return {data:{id:'chat',channel:'messenger',customer_psid:'customer',account_id:'page'}};
   if(table==='messenger_messages' && operation==='select') return {data:{created_time:options.expired?'2020-01-01':new Date().toISOString()}};
   return {};
  }
  return q;
 },async rpc(_,{mid,new_status}){for(const row of rows.values()) if(row.provider_message_id===mid) row.status=new_status;return {};}};
 class MetaError extends Error {constructor(code,uncertain){super();this.code=code;this.uncertain=uncertain;}}
 const mockRequire=name=> name==='server-only'?{}:name==='crypto'?crypto:name==='zod'?require('zod'):name.includes('supabase/admin')?{createAdminClient:()=>db}:name==='./policy'?{replyWindow:date=>({open:Date.now()-Date.parse(date)<86400000})}:name==='./templates'?{templates:async()=>[]}:name==='./providers/meta'?{MetaError,enabled:()=>true,credentials:async()=>({token:'test'}),meta:async()=>{sends++;if(options.timeout) throw new MetaError(0,true);return {message_id:'mid'};}}:require(name);
 const context={exports:{},require:mockRequire,Date,console};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/messenger/send.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
 return {send:context.exports.sendMessage,rows,sends:()=>sends};
}
const input={id:'53b90d57-e26e-4095-b5e1-6ccfc8302a79',conversation:'chat',text:'Hello'};
const user={id:'admin',name:'Admin'};
test('repeated submission uses one provider call and rejects changed payload',async()=>{
 const s=setup();await s.send(input,user);await s.send(input,user);assert.equal(s.sends(),1);
 await assert.rejects(s.send({...input,text:'Changed'},user),/conflict/);assert.equal(s.sends(),1);
});
test('ambiguous timeout is durable and never resent on retry',async()=>{
 const s=setup({timeout:true});assert.equal((await s.send(input,user)).status,'unknown');
 assert.equal((await s.send(input,user)).status,'unknown');assert.equal(s.sends(),1);
});
test('expired window rejects before any outbox or provider write',async()=>{
 const s=setup({expired:true});await assert.rejects(s.send(input,user),/window/);assert.equal(s.sends(),0);assert.equal(s.rows.size,0);
});
test('an existing request cannot be claimed by another staff user',async()=>{
 const s=setup();await s.send(input,user);await assert.rejects(s.send(input,{id:'other',name:'Other'}),/conflict/);assert.equal(s.sends(),1);
});

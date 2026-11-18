const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/lib/messenger/followupReplies.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const findFollowups = (m) => JSON.parse(JSON.stringify(context.exports.findFollowups(m)));

const H = 60 * 60 * 1000;
const T0 = Date.parse('2026-11-01T02:00:00Z');
const at = (hours) => new Date(T0 + hours * H).toISOString();
const them = (hours, text = 'hi') => ({ from_page: false, created_time: at(hours), text });
const us = (hours, text = 'Chào bạn') => ({ from_page: true, created_time: at(hours), text });
const plain = (events) => events.map((e) => ({ nth: e.nth, at: e.at, answeredAt: e.answeredAt, superseded: e.superseded, zalo: e.zalo }));

test('a late first answer to a waiting person is not a follow-up', () => {
  assert.deepEqual(plain(findFollowups([them(0), us(30)])), []);
});

test('we answered, they went quiet, we wrote 24h+ later: 1st follow-up, answered', () => {
  const e = findFollowups([them(0), us(1), us(26), them(40)]);
  assert.equal(e.length, 1);
  assert.equal(e[0].nth, 1);
  assert.equal(e[0].at, at(26));
  assert.equal(e[0].answeredAt, at(40));
  assert.equal(e[0].answerSeconds, 14 * 3600);
});

test('the 1st follow-up is measured from their message, not from our reply', () => {
  // Our reply at 23h, follow-up at 25h: 25h after their message, only 2h after ours.
  assert.equal(findFollowups([them(0), us(23), us(25)]).length, 1);
});

test('a burst within 24h is one follow-up', () => {
  const e = findFollowups([them(0), us(1), us(30), us(30.2), us(31)]);
  assert.equal(e.length, 1);
  assert.equal(e[0].answeredAt, null);
  assert.equal(e[0].superseded, false);
});

test('24h+ after our last message, still silent: 2nd and 3rd follow-up', () => {
  const e = findFollowups([them(0), us(1), us(30), us(60), us(100), them(101)]);
  assert.deepEqual(e.map((x) => x.nth), [1, 2, 3]);
  assert.deepEqual(e.map((x) => x.superseded), [true, true, false]);
  assert.deepEqual(e.map((x) => x.answeredAt), [null, null, at(101)]);
});

test('an answer in the middle of a burst belongs to that follow-up, and the count starts again', () => {
  const e = findFollowups([them(0), us(1), us(30), them(30.5), us(31), us(60)]);
  assert.equal(e.length, 2);
  assert.equal(e[0].answeredAt, at(30.5));
  // us(31) answers them; us(60) is 29.5h after their message, so it is a new 1st follow-up.
  assert.equal(e[1].nth, 1);
  assert.equal(e[1].at, at(60));
});

test('a follow-up mentioning Zalo is marked, and still counts for the next number', () => {
  const e = findFollowups([them(0), us(1), us(30, 'Bạn nhắn Zalo nhé'), us(60)]);
  assert.deepEqual(plain(e).map((x) => [x.nth, x.zalo]), [[1, true], [2, false]]);
});

test('Zalo later in the same burst marks that follow-up', () => {
  const e = findFollowups([them(0), us(1), us(30), us(30.5, 'zalo: 0123')]);
  assert.equal(e[0].zalo, true);
});

test('no message from the person: nothing is a follow-up; order of input does not matter', () => {
  assert.deepEqual(plain(findFollowups([us(0), us(30)])), []);
  const e = findFollowups([us(26), them(0), us(1)]);
  assert.equal(e.length, 1);
});

test('a quick extra message after a late reply is part of that reply, not a follow-up', () => {
  assert.equal(findFollowups([them(0), us(30), us(30.1)]).length, 0);
  // A real follow-up 24h+ after that late reply counts as the 1st.
  const e = findFollowups([them(0), us(30), us(30.1), us(60)]);
  assert.equal(e.length, 1);
  assert.equal(e[0].nth, 1);
  assert.equal(e[0].at, at(60));
});

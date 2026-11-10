import type { ReplyExample } from "./examples";

/** Very common Vietnamese/German chat words that say nothing about the topic. */
const STOP = new Set(
  "em anh chị chi ạ a ơi oi là có không ko k cho và của mình minh bạn ban thì được duoc nha nhé nhe với này để các một những thế vậy vay ạh dạ da hả trung tâm tâm mà nè ne luôn rồi roi đã sẽ đang ở o thể muốn hỏi hoi xin chào chao ich und der die das ist ein eine zu".split(" "),
);

function tokens(s: string): string[] {
  const words = s
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1 && !STOP.has(w));
  // Vietnamese words are often two syllables („học phí“, „du học“), so pairs count too.
  const pairs = words.slice(1).map((w, i) => `${words[i]}_${w}`);
  return [...words, ...pairs];
}

/** The `n` examples most similar to the conversation (BM25 on words and word pairs), in their original order.
 *  Keeps the prompt small however many examples there are in Notion. */
export function pickExamples(examples: ReplyExample[], conversation: string, n = 40): ReplyExample[] {
  if (examples.length <= n) return examples;
  const docs = examples.map((e) => tokens(`${e.question} ${e.question} ${e.answer}`)); // question counts double
  const avg = docs.reduce((s, d) => s + d.length, 0) / docs.length;
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
  const query = [...new Set(tokens(conversation))];
  const k1 = 1.2;
  const b = 0.75;

  const scored = docs.map((d, i) => {
    const tf = new Map<string, number>();
    for (const t of d) tf.set(t, (tf.get(t) ?? 0) + 1);
    let score = 0;
    for (const q of query) {
      const f = tf.get(q);
      if (!f) continue;
      const idf = Math.log(1 + (docs.length - df.get(q)! + 0.5) / (df.get(q)! + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.length) / avg));
    }
    return { i, score };
  });

  const keep = new Set(
    scored
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map((s) => s.i),
  );
  return examples.filter((_, i) => keep.has(i));
}

#!/usr/bin/env node
// Generic kie.ai job runner for models kie.mjs doesn't wrap.
//   node kiejob.mjs <model> <out> '<input json>'   (any "@path" value is uploaded first)
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.kie.ai';
const UPLOAD = 'https://kieai.redpandaai.co/api/file-base64-upload';
const env = fs.readFileSync(path.resolve(import.meta.dirname, '../../../../.env'), 'utf8');
const KEY = process.env.KIE_AI_API_KEY || env.match(/^\s*KIE_AI_API_KEY\s*=\s*["']?(.+?)["']?\s*$/m)[1];
const H = {'Content-Type': 'application/json', Authorization: `Bearer ${KEY}`};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function upload(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  const res = await fetch(UPLOAD, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      base64Data: `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`,
      uploadPath: 'scrollcraft',
      fileName: path.basename(file),
    }),
  });
  const j = await res.json();
  const url = j?.data?.downloadUrl || j?.data?.fileUrl || j?.data?.url;
  if (!url) throw new Error('upload failed: ' + JSON.stringify(j));
  return url;
}

async function resolve(v) {
  if (typeof v === 'string' && v.startsWith('@')) return upload(v.slice(1));
  if (Array.isArray(v)) return Promise.all(v.map(resolve));
  return v;
}

const [model, out, json] = process.argv.slice(2);
const input = JSON.parse(json);
for (const k of Object.keys(input)) input[k] = await resolve(input[k]);

const created = await (await fetch(`${API}/api/v1/jobs/createTask`, {method: 'POST', headers: H, body: JSON.stringify({model, input})})).json();
if (created.code !== 200) throw new Error(`createTask ${model}: ${JSON.stringify(created)}`);
const id = created.data.taskId;
const t0 = Date.now();
for (;;) {
  const d = (await (await fetch(`${API}/api/v1/jobs/recordInfo?taskId=${id}`, {headers: H})).json()).data || {};
  if (d.state === 'success') {
    const r = typeof d.resultJson === 'string' ? JSON.parse(d.resultJson) : d.resultJson;
    const url = (r.resultUrls || r.result_urls || [])[0];
    fs.writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
    console.log(out);
    break;
  }
  if (d.state === 'fail') throw new Error(`${model} failed: ${d.failMsg || d.failCode}`);
  if (Date.now() - t0 > 20 * 60 * 1000) throw new Error('timeout');
  await sleep(5000);
}

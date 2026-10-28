// ============================================================
//  The Real You Initiative - database backend
// ------------------------------------------------------------
//  * Receives every form submission from the website
//    (POST /api/submit) and saves it into an SQLite database
//    file called "submissions.db" (created automatically).
//  * Lets YOU (and only you) read the submissions:
//      - Admin page:  http://localhost:4000/admin
//      - JSON API:    GET /api/submissions  (needs the admin key)
//
//  This server uses ONLY features built into Node.js itself
//  (including its built-in SQLite), so there is NOTHING to
//  install. You need Node.js version 22 or newer.
//
//  Start it with:   node server.js
//        or:        npm start
// ============================================================

const fs = require("fs");
const path = require("path");
const http = require("http");
const { DatabaseSync } = require("node:sqlite");

// ---- tiny .env reader ----
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const PORT = process.env.PORT || 4000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change-me-to-a-long-secret-password";

// ---- database (SQLite file, created automatically) ----
const db = new DatabaseSync(path.join(__dirname, "submissions.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    form_type   TEXT NOT NULL,
    name        TEXT,
    email       TEXT,
    phone       TEXT,
    message     TEXT,
    data_json   TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
const insertStmt = db.prepare(`
  INSERT INTO submissions (form_type, name, email, phone, message, data_json)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const listStmt = db.prepare("SELECT * FROM submissions ORDER BY id DESC LIMIT 500");

// ---- helpers ----
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 1_000_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); }
    });
  });
}

const ADMIN_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>TRY - Submissions Admin</title>
<style>
 body{font-family:system-ui,Arial,sans-serif;background:#0e241a;color:#f2f2f2;margin:0;padding:24px}
 h1{color:#D8AC55} input,button{padding:10px 14px;border-radius:8px;border:1px solid #2c5542;font-size:15px}
 button{background:#1F6B4A;color:#fff;cursor:pointer}
 table{width:100%;border-collapse:collapse;margin-top:20px;background:#123B2A}
 th,td{border:1px solid #2c5542;padding:8px 10px;text-align:left;font-size:14px;vertical-align:top}
 th{background:#1F6B4A} pre{white-space:pre-wrap;margin:0;font-size:13px}
 .reply{display:flex;flex-direction:column;gap:8px;min-width:170px}
 .rbtn{display:inline-block;padding:9px 12px;border-radius:8px;text-decoration:none;font-size:14px;text-align:center}
 .rbtn.gold{background:#D8AC55;color:#123B2A;font-weight:600}
 .rbtn.green{background:#1F6B4A;color:#fff}
 .rbtn.plain{background:transparent;color:#cfe6d8;border:1px solid #2c5542;font-size:13px}
 .none{color:#9db8a9;font-size:13px}
</style></head><body>
<h1>The Real You Initiative - Form Submissions</h1>
<p>Type your ADMIN_KEY (from backend/.env) to view submissions saved in the database.</p>
<input id="key" type="password" placeholder="Admin key" size="40">
<button onclick="load()">View submissions</button>
<div id="out"></div>
<script>
function esc(t){ return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pickField(data, words){
  if(!data) return '';
  var keys=Object.keys(data);
  for(var i=0;i<keys.length;i++){
    var lk=keys[i].toLowerCase();
    for(var w=0;w<words.length;w++){
      if(lk.indexOf(words[w])!==-1){
        var v=data[keys[i]];
        if(v!==null && v!==undefined && String(v).trim()!=='') return String(v).trim();
      }
    }
  }
  return '';
}
function waNumber(phone){
  var d=String(phone||'').replace(/[^0-9]/g,'');
  if(!d) return '';
  if(d.charAt(0)==='0') d='234'+d.slice(1);
  else if(d.length===10 && (d.charAt(0)==='7'||d.charAt(0)==='8'||d.charAt(0)==='9')) d='234'+d;
  return d;
}
function prettyForm(ft){
  return String(ft||'website form').replace(/[-_]+/g,' ').replace(/\\b\\w/g,function(c){return c.toUpperCase();});
}
async function load(){
  const key=document.getElementById('key').value;
  const r=await fetch('/api/submissions',{headers:{'x-admin-key':key}});
  const out=document.getElementById('out');
  if(!r.ok){ out.innerHTML='<p style="color:#ef9a9a">Wrong admin key.</p>'; return; }
  const j=await r.json();
  if(!j.count){ out.innerHTML='<p>No submissions yet.</p>'; return; }
  let h='<table><tr><th>#</th><th>Date (UTC)</th><th>Form</th><th>All fields</th><th>Reply</th></tr>';
  for(const s of j.submissions){
    var d=s.data||{};
    var name=s.name||pickField(d,['full name','fullname','name']);
    var email=s.email||pickField(d,['email','e-mail']);
    var phone=s.phone||pickField(d,['whatsapp','phone','tel']);
    var first=name?name.split(' ')[0]:'there';
    var formLabel=prettyForm(s.form_type);
    var subject='Re: Your '+formLabel+' submission - The Real You Initiative';
    var body='Hello '+first+',\\n\\nThank you for reaching out to The Real You Initiative through our '+formLabel+' form. We have received your message and we are glad you connected with us.\\n\\n[Write your reply here]\\n\\nWarm regards,\\nThe Real You Initiative team\\nRaising a Generation That Matters.';
    var btns='';
    if(email){
      var gmail='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(email)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var mailto='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      btns+='<a class="rbtn gold" target="_blank" rel="noopener" href="'+gmail+'">Reply by email (Gmail)</a>';
      btns+='<a class="rbtn plain" href="'+mailto+'">Use email app instead</a>';
    }
    var wa=waNumber(phone);
    if(wa){
      var wtext='Hello '+first+', this is The Real You Initiative team. Thank you for filling our '+formLabel+' form on our website. We are replying to your message here.';
      btns+='<a class="rbtn green" target="_blank" rel="noopener" href="https://wa.me/'+wa+'?text='+encodeURIComponent(wtext)+'">Reply on WhatsApp</a>';
    }
    if(!btns) btns='<span class="none">No email or phone was given on this submission.</span>';
    h+='<tr><td>'+s.id+'</td><td>'+esc(s.created_at)+'</td><td>'+esc(s.form_type)+'</td><td><pre>'+
       esc(JSON.stringify(s.data,null,2))+'</pre></td><td><div class="reply">'+btns+'</div></td></tr>';
  }
  out.innerHTML=h+'</table>';
}
</script></body></html>`;

// ---- server ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, { ok: true, service: "try-backend" });
  }

  if (req.method === "POST" && url.pathname === "/api/submit") {
    const body = await readBody(req);
    const info = insertStmt.run(
      String(body.form_type || "website-form"),
      body.name || body.full_name || body["Full name"] || null,
      body.email || body.email_address || null,
      body.phone || body.phone_number || null,
      body.message || body.comments || null,
      JSON.stringify(body)
    );
    return sendJson(res, 201, { ok: true, id: Number(info.lastInsertRowid) });
  }

  if (req.method === "GET" && url.pathname === "/api/submissions") {
    const key = req.headers["x-admin-key"] || url.searchParams.get("key");
    if (key !== ADMIN_KEY) return sendJson(res, 401, { ok: false, error: "Wrong admin key" });
    const rows = listStmt.all().map((r) => {
      const { data_json, ...rest } = r;
      return { ...rest, data: JSON.parse(data_json) };
    });
    return sendJson(res, 200, { ok: true, count: rows.length, submissions: rows });
  }

  if (req.method === "GET" && url.pathname === "/admin") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(ADMIN_PAGE);
  }

  return sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, () => {
  console.log("TRY backend running at http://localhost:" + PORT);
  console.log("Admin page:           http://localhost:" + PORT + "/admin");
  if (ADMIN_KEY === "change-me-to-a-long-secret-password") {
    console.log("WARNING: set your own ADMIN_KEY in backend/.env before going live.");
  }
});

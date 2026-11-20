import http from 'node:http';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
http.createServer((req,res)=>{const raw=new URL(req.url,'http://localhost').pathname;const file=raw==='/'?'index.html':decodeURIComponent(raw).slice(1);if(!['index.html','Ambedkar_and_His_Dhamma.html','evidence.json'].includes(file)){res.writeHead(404);res.end('Not found');return;}try{res.setHeader('Content-Type',file.endsWith('.json')?'application/json; charset=utf-8':'text/html; charset=utf-8');res.end(readFileSync(path.join(root,file)));}catch{res.writeHead(404);res.end('Not found');}}).listen(8766,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8766'));

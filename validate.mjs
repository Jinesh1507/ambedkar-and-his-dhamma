import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {sources,topics,entries} from './content.mjs';
import {contexts} from './contexts.mjs';
const html=readFileSync('dist/index.html','utf8');
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs');
for(const m of html.matchAll(/href="#([^"]+)"/g))if(!ids.includes(m[1]))throw Error('Broken anchor '+m[1]);
for(const e of entries){
 if(!sources[e.source]||!topics.some(t=>t.id===e.topic))throw Error(e.id);
 for(const [k]of e.refs)if(!sources[k])throw Error('Missing source '+k);
 for(const key of ['title','page','text','reading','limit'])if(!e[key])throw Error('Missing '+key+' in '+e.id);
 if(!contexts[e.id]?.length)throw Error('Missing context '+e.id);
 for(const c of contexts[e.id])if(!sources[c.source]||!c.locator||!c.paragraphs?.length)throw Error('Invalid context '+e.id);
}
const quoteWords={};
for(const e of entries)for(const q of[e.q,e.q2].filter(Boolean))quoteWords[e.source]=(quoteWords[e.source]||0)+q.trim().split(/\s+/).length;
for(const blocks of Object.values(contexts))for(const c of blocks)if(c.quote)quoteWords[c.source]=(quoteWords[c.source]||0)+c.quote.trim().split(/\s+/).length;
for(const [k,n]of Object.entries(quoteWords))if(n>25)throw Error('Quotation budget '+k);
new vm.Script(readFileSync('client.js','utf8'));
const embedded=JSON.parse(html.match(/<script type="application\/json" id="dossier-data">([\s\S]*?)<\/script>/)[1]);
if(embedded.entries.length!==entries.length)throw Error('Stale build');
if(embedded.entries.some(e=>!e.context?.length))throw Error('Missing embedded context');
if(readFileSync('dist/Ambedkar_and_His_Dhamma.html','utf8')!==html)throw Error('Offline edition differs');
console.log(JSON.stringify({anchors:ids.length,findings:entries.length,sources:Object.keys(sources).length,quoteWords,clientSyntax:'passed',embeddedData:'passed',offlineEdition:'matched'}));

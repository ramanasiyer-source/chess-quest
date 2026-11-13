// Mock of the Apps Script endpoint for local testing: node tests/mock_server.js
const http=require('http'); let store={updatedAt:0,state:null}; let rows={daily:null,ledger:[]};
http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Access-Control-Allow-Headers','*');
  if(req.method==='OPTIONS'){res.end();return}
  if(req.method==='GET'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({status:'success',...store}));return}
  let b='';req.on('data',d=>b+=d);req.on('end',()=>{const p=JSON.parse(b);store={updatedAt:p.updatedAt,state:p.state};rows.daily=p.today;rows.ledger.push(...(p.ledger||[]));console.log('POST saveState stars-ledger',rows.ledger.length,'today',JSON.stringify(p.today));res.end('{"status":"success"}')});
}).listen(8765,()=>console.log('mock on 8765'));

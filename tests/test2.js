(async function(){
const out=[]; const ok=(n,c,x)=>out.push((c?'PASS ':'FAIL ')+n+(x!==undefined?' :: '+x:''));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await wait(300);
try{
 for (const drill of ['kqk','krk']) {
  CQ_EG.id=drill; document.querySelector('[data-tab=endgames]').click(); await wait(100);
  document.querySelector('#eg-sel').value=drill; document.querySelector('#eg-sel').onchange({target:{value:drill}}); await wait(50);
  let won=false, steps=0;
  const dist=(a,b)=>Math.max(Math.abs(a.charCodeAt(0)-b.charCodeAt(0)),Math.abs(+a[1]-+b[1]));
  const find=(ch,color,type)=>{for(const f of 'abcdefgh')for(let r=1;r<=8;r++){const p=ch.get(f+r);if(p&&p.color===color&&p.type===type)return f+r}};
  while(!CQ_EG.over && steps<45){
    const b=CQ_EG.board, ch=b.chess; steps++;
    let best=null,bs=-1e9;
    for(const m of ch.moves({verbose:true})){
      const c=new Chess(ch.fen()); c.move(m);
      if(c.in_checkmate()){best=m;bs=1e9;break;}
      if(c.game_over()) continue;
      // hanging piece check: can black capture something?
      const caps=c.moves({verbose:true}).filter(x=>x.captured); 
      let penalty=0; if(caps.length){ penalty=1000; }
      const bk=find(c,'b','k'), wk=find(c,'w','k');
      const bmoves=c.moves().length;
      const edge=Math.max(Math.abs(bk.charCodeAt(0)-100.5),Math.abs(+bk[1]-4.5));
      const score=-penalty-bmoves*6+edge*8-dist(wk,bk)*3;
      if(score>bs){bs=score;best=m;}
    }
    b.click(best.from); b.click(best.to); await wait(700);
  }
  const msg=document.querySelector('#eg-msg').textContent;
  ok(drill+' mate achieved via UI', /CHECKMATE/.test(msg), msg.slice(0,80)+' | moves='+CQ_EG.moves);
  ok(drill+' wins recorded', (CQ.S.endgames[drill]||{}).wins>=1);
 }
 ok('endgame stars awarded', CQ.S.ledger.some(e=>e.type==='endgame'), JSON.stringify(CQ.S.endgames));
 ok('no runtime errors', __errs.length===0, __errs.join(' | '));
}catch(e){ ok('EXCEPTION', false, e.stack||e); }
document.getElementById('result').textContent=out.join('\n')+'\nDONE';
})();

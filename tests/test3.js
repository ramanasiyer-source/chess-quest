(async function(){
const out=[]; const ok=(n,c,x)=>out.push((c?'PASS ':'FAIL ')+n+(x!==undefined?' :: '+x:''));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await wait(200);
try{
 const URL='http://localhost:8765/exec';
 // ---- device A
 CQ.S.settings.syncUrl=URL; CQ.S.settings.name='Test';
 CQ.addStars(40,'bonus','A earns','a1'); const d=CQ.day(); d.sec.p1=600; d.sec.p2=600; d.sec.p3=600; d.done.p1=d.done.p2=d.done.p3=true; d.questComplete=true; CQ.commit();
 await CQ.cloudPush(); await wait(300);
 ok('A push ok', CQ.sync.status==='ok', CQ.sync.status);
 const starsA=CQ.balance();
 const snapA=JSON.parse(JSON.stringify(CQ.S));
 // ---- device B (fresh install) joins via pull
 localStorage.clear(); location.hash='';
 const Bsave=JSON.stringify(CQ.S);
 CQ.S.ledger.length=0; Object.keys(CQ.S.days).forEach(k=>delete CQ.S.days[k]); CQ.S.updatedAt=0; CQ.S.settings.syncUrl=URL;
 ok('B starts empty', CQ.balance()===0);
 await CQ.cloudPull(); 
 ok('B pulled stars', CQ.balance()===starsA, CQ.balance()+' vs '+starsA);
 ok('B pulled quest complete + streak', CQ.day().questComplete && CQ.streak()>=1);
 // ---- B earns more, A (stale) earns different, both push -> merged
 CQ.addStars(7,'bonus','B earns','b1'); CQ.commit(); await CQ.cloudPush(); await wait(200);
 // simulate A being stale: restore snapA then add its own
 Object.assign(CQ.S, snapA); CQ.S.ledger=snapA.ledger.slice(); CQ.addStars(5,'bonus','A earns later','a2'); CQ.commit(); await CQ.cloudPush(); await wait(300);
 ok('merge keeps both devices stars', CQ.balance()===starsA+7+5, CQ.balance()+' expected '+(starsA+12));
 ok('no errors', __errs.length===0, __errs.join('|'));
}catch(e){ ok('EXCEPTION', false, e.stack||e); }
document.getElementById('result').textContent=out.join('\n')+'\nDONE';
})();

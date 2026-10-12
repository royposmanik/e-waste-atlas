// Usage: node data/build-data.js data/raw  -> writes data/data.js
const fs=require('fs'),dir=process.argv[2];
const R=f=>JSON.parse(fs.readFileSync(dir+'/'+f,'utf8'));
const SUB={15:'Northern Africa',14:'Eastern Africa',17:'Middle Africa',18:'Southern Africa',11:'Western Africa',29:'Caribbean',13:'Central America',5:'South America',21:'Northern America',143:'Central Asia',30:'Eastern Asia',35:'South-Eastern Asia',34:'Southern Asia',145:'Western Asia',151:'Eastern Europe',154:'Northern Europe',39:'Southern Europe',155:'Western Europe',53:'Australia & New Zealand',54:'Melanesia',57:'Micronesia',61:'Polynesia'};
const CONT={2:'Africa',19:'Americas',142:'Asia',150:'Europe',9:'Oceania'};
const tree=R('tree.json');const c2s={};
function walk(n,sub){const code=+n.geoAreaCode;if(SUB[code])sub=code;if(n.type==='Country'&&sub)c2s[code]=sub;(n.children||[]).forEach(c=>walk(c,sub));}
tree.forEach(t=>walk(t,null));
const Y0=2010,Y1=2025,series={gen:'EN_EWT_GENV',pc:'EN_EWT_GENPCAP',rec:'EN_EWT_RCYV',rr:'EN_EWT_RCYR'};
const out={y0:Y0,y1:Y1,lastObs:2022,r:{},c:{},w:{}};
const blank=()=>Array(Y1-Y0+1).fill(null);
for(const k in series){const d=R(series[k]+'.json').data;
 for(const x of d){const code=+x.geoAreaCode,y=x.timePeriodStart;if(y<Y0||y>Y1)continue;
  let v=+x.value; if(k==='gen'||k==='rec')v=v/1e3; // kt
  v=Math.round(v*100)/100;
  const tgt=SUB[code]?out.r:CONT[code]?out.c:code===1?out.w:null; if(!tgt)continue;
  const key=SUB[code]?code:CONT[code]?code:'w';
  if(tgt===out.w){(out.w[k]=out.w[k]||blank())[y-Y0]=v}else{tgt[key]=tgt[key]||{};(tgt[key][k]=tgt[key][k]||blank())[y-Y0]=v}
 }}
const w=R('w.json');const ids=w.objects.countries.geometries.map(g=>({id:g.id,n:g.properties.name}));
const miss=ids.filter(g=>!c2s[+g.id]).map(g=>g.id+' '+g.n);console.error('unmapped:',miss.join('; '));
const map={};ids.forEach(g=>{if(c2s[+g.id])map[g.id]=c2s[+g.id]});
map['158']=30; // Taiwan -> Eastern Asia
fs.writeFileSync(require('path').join(__dirname,'data.js'),'var EW='+JSON.stringify(out)+';\nvar SUBN='+JSON.stringify(SUB)+';\nvar CONTN='+JSON.stringify(CONT)+';\nvar ID2SUB='+JSON.stringify(map)+';\n');
console.error('regions',Object.keys(out.r).length, 'size',fs.statSync(require('path').join(__dirname,'data.js')).size);

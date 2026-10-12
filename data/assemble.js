// Builds ../e-waste-atlas.html from the template, data.js, category/element photos and the export logos.
// Usage: node data/assemble.js   (run data/build-data.js first to refresh data.js)
const fs=require('fs'),path=require('path'),d=__dirname,root=path.join(d,'..'),img=path.join(root,'assets','img');
const b64=(f,type)=>'data:'+type+';base64,'+fs.readFileSync(f).toString('base64');
function photoSet(json){const p=JSON.parse(fs.readFileSync(path.join(d,json),'utf8'));for(const k in p)p[k].src=b64(path.join(root,p[k].file),'image/jpeg');return p}
const photos=photoSet('element-images.json'),catPhotos=photoSet('category-images.json');
const inject=fs.readFileSync(path.join(d,'data.js'),'utf8').trim()+
 '\nvar ELIMG='+JSON.stringify(photos)+';'+
 '\nvar CATIMG='+JSON.stringify(catPhotos)+';'+
 '\nvar LOGO_W2R="'+b64(path.join(img,'w2r-badge-export.png'),'image/png')+'";'+
 '\nvar LOGO_TECHNION="'+b64(path.join(img,'technion-logo-export.png'),'image/png')+'";';
const src=fs.readFileSync(path.join(d,'e-waste-atlas.template.html'),'utf8');
if(!src.includes('/*DATA*/'))throw new Error('marker /*DATA*/ missing');
fs.writeFileSync(path.join(root,'e-waste-atlas.html'),src.replace('/*DATA*/',()=>inject));
console.log('wrote e-waste-atlas.html');

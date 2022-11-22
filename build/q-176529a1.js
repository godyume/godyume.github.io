var E=Object.defineProperty;var $=(c,e,t)=>e in c?E(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var y=(c,e,t)=>($(c,typeof e!="symbol"?e+"":e,t),t);import{c as C,q as M,_ as B}from"./q-9f777f0a.js";class v{constructor(e){this.name=e}toString(){return this.name}}class L extends v{}class w extends v{}class T{constructor(e,t,s){this.teacher=e,this.course=t,this.index=s}toString(){return`${this.teacher.name} ${this.course.name}${this.index}`}}class A{constructor(e,t){this.from=e,this.to=t}toString(){return`\u73ED\u7D1A'${this.from.course.name}': [${this.from.teacher.name} ${+this.from.index+1}] <-> [${this.to.teacher.name} ${+this.to.index+1}]`}removes(){return[this.from,this.to]}addFrom(){return new T(this.from.teacher,this.from.course,this.to.index)}addTo(){return new T(this.to.teacher,this.to.course,this.from.index)}}let u;(function(c){c[c.invalid=0]="invalid",c[c.tempValid=1]="tempValid",c[c.valid=2]="valid"})(u||(u={}));class x{constructor(){y(this,"changes",[]);y(this,"set2",[]);y(this,"days",5);y(this,"courses",7)}index(e,t){return+this.courses*e+t}indexOf(e){return this.set2.findIndex(t=>t.teacher.name===e.teacher.name&&t.course.name===e.course.name&&t.index==e.index)}delete(e){const t=this.indexOf(e);t>-1&&this.set2.splice(t,1)}setDays(e){this.days=Math.min(Math.max(+e,1),7)}setCourses(e){this.courses=Math.max(+e,1)}parse(e){return e.split(`
`).flatMap((s,h)=>s.split(",").flatMap((a,i)=>{if(a==="")return[];if(i>this.courses)return[];const n=new w(a),r=+h*+this.courses+i;return[[n,r]]}))}setup(e,t){const s=new L(e);for(const[h,d]of this.parse(t)){const a=new T(s,h,d);this.set2.push(a)}}all(){return this.set2}findByTeacher(e,t){return t!=null?this.all().filter(s=>s.teacher.name===e.name&&s.index==t):this.all().filter(s=>s.teacher.name==e.name)}findByCourse(e,t){return t!=null?this.all().filter(s=>s.course.name===e.name&&s.index===t):this.all().filter(s=>s.course.name===e.name)}findByIndex(e){const t=+e%+this.courses+1,s=+e/+this.courses+1;return[t,s]}copy(){const e=new x;return e.set2=Array.from(this.set2),e.changes=Array.from(this.changes),e.days=this.days,e.courses=this.courses,e}append(e){const t=this.copy();if(t.changes.push(e),this.changes.length!=0&&this.changes[0].from.index==e.to.index)return[t,u.invalid];for(const s of e.removes())if(t.indexOf(s)!=-1)t.delete(s);else return[t,u.invalid];if(this.findByTeacher(e.addTo().teacher,e.addTo().index).length==0)t.set2.push(e.addTo());else return[t,u.invalid];switch(this.findByTeacher(e.addFrom().teacher,e.addFrom().index).length){case 0:return t.set2.push(e.addFrom()),[t,u.valid];case 1:return t.set2.push(e.addFrom()),[t,u.tempValid];default:return[t,u.invalid]}}change(e,t,s){const h=this.findByTeacher(e,t);if(h.length<=0)return[];const d=h[0].course,a=new T(e,d,t);return this._change(a,s)}_change(e,t){return t<=0?[]:this.findByCourse(e.course).filter(d=>d.teacher.name!==e.teacher.name).flatMap(d=>{const a=new A(e,d),[i,n]=this.append(a);switch(n){case u.invalid:return[];case u.valid:return[i];case u.tempValid:const r=e.teacher,m=a.to.index;return this.findByTeacher(r,m).filter(o=>o.course.name!==e.course.name).flatMap(o=>i._change(o,+t-1))}})}renderTable(e,t,s){e.innerHTML="";const h=new Array(this.days).fill(0).map((n,r)=>r).reverse(),d=new Array(this.courses).fill(0).map((n,r)=>r),a=document.createElement("tr");for(const n of h){const r=document.createElement("th");r.innerHTML=`\u661F\u671F${n+1}`,a.appendChild(r)}const i=document.createElement("td");i.innerHTML="",a.appendChild(i),e.appendChild(a);for(const n of d){const r=document.createElement("tr");for(const o of h){const l=document.createElement("td"),f=+this.courses*o+n,p=this.findByTeacher(t,f);l.id=`o${f}`,p.length>0?(l.innerHTML=`${p[0].course.name}`,l.onclick=()=>{s(f,l)}):l.innerHTML="",r.appendChild(l)}const m=document.createElement("td");m.innerHTML=`\u7B2C${n+1}\u7BC0`,r.appendChild(m),e.appendChild(r)}}renderTable2(e,t){e.innerHTML="";const s=new Array(this.days).fill(0).map((i,n)=>n).reverse(),h=new Array(this.courses).fill(0).map((i,n)=>n),d=document.createElement("tr");for(const i of s){const n=document.createElement("th");n.innerHTML=`\u661F\u671F${i+1}`,d.appendChild(n)}const a=document.createElement("td");a.innerHTML="",d.appendChild(a),e.appendChild(d);for(const i of h){const n=document.createElement("tr");for(const m of s){const o=document.createElement("td"),l=document.createElement("div"),f=document.createElement("p"),p=this.index(m,i),g=this.findByTeacher(t,p);l.id=`t${p}`,g.length>0?f.innerHTML=`${g[0].course.name}`:f.innerHTML="",n.appendChild(o),o.appendChild(l),l.appendChild(f)}const r=document.createElement("td");r.innerHTML=`\u7B2C${i+1}\u7BC0`,n.appendChild(r),e.appendChild(n)}for(const i of this.changes){const n=document.getElementById(`t${i.from.index}`);n&&(n.innerHTML="");const r=document.getElementById(`t${i.to.index}`);r&&(r.innerHTML="")}for(const[i,n]of this.changes.entries()){const r=document.getElementById(`t${n.from.index}`);if(r){const o=document.createElement("p");r.appendChild(o),o.style.background="#e44",o.style.color="#fff",o.innerHTML=`Step. ${i}<br>- \u73ED\u7D1A${n.from.course.name} \u8001\u5E2B${n.to.teacher.name}`}const m=document.getElementById(`t${n.to.index}`);if(m){const o=document.createElement("p");m.appendChild(o),o.style.background="#4e4",o.style.color="#fff",o.innerHTML=`Step. ${i}<br>+ \u73ED\u7D1A${n.from.course.name} \u8001\u5E2B${n.to.teacher.name}`}}}}const H=new x,_=C(M(()=>B(()=>import("./q-376de2fa.js"),["build/q-376de2fa.js","build/q-9f777f0a.js"]),"s_xYL1qOwPyDI")),D={title:"\u8ABF\u8AB2\u7528"},O=Object.freeze(Object.defineProperty({__proto__:null,env:H,default:_,head:D},Symbol.toStringTag,{value:"Module"}));export{L as T,H as e,O as i};

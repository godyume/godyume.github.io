import{e as f,o as P,q as i,_ as c,f as I,j as e,l as E,F as L}from"./q-30db69eb.js";import{T as y,g as m,c as _,a as B,e as p}from"./q-d3be2fbb.js";const w=t=>{const[n]=f(),s=t.target.value,r=new y(n.sTeacher),l=document.getElementById("toTable"),o=m.sols[+s];l&&o.renderTable2(l,r);const h=o.changes.map(v=>v.toString()).join(`<br>
`);n.sol=h},D=t=>{const[n]=f();_(),B();const s=t.target.value;n.sTeacher=s;const r=new y(s),l=document.getElementById("originTable");l&&p.renderTable(l,r,(o,h)=>{const v=document.getElementById(`o${n.index}`);if(v&&(v.style.background="#fff"),n.index=o,h.style.background="#cc0",m.sols=p.change(r,o,n.steps).sort((d,u)=>d.changes.length-u.changes.length),m.sols.length>0){const d=document.getElementById("ss");d.innerHTML="";for(const[u,b]of m.sols.entries()){const g=document.createElement("option");if(u==0){g.selected=!0;const x=document.getElementById("toTable");if(x){b.renderTable2(x,r);const T=b.changes.map(S=>S.toString()).join("<br>");n.sol=T}}g.value=u.toString(),g.innerHTML=`\u7D50\u679C ${u} ${b.changes.length}\u6B65\u9A5F`,d==null||d.appendChild(g)}}})},R=async t=>{_();const n=t.target.files;if(n){const s=[];for(const l of n){const o=l.name.split(".")[0].toString();s.push(o);const h=await l.text();p.setup(o,h)}const r=document.getElementById("s");for(const l of s){const o=document.createElement("option");o.value=l,o.innerHTML=l,r==null||r.appendChild(o)}}},j=()=>{P(i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_6r9BnBnj0sQ"));const t=I({teachers:new Array,sTeacher:"",index:0,steps:2,sol:""});return e(L,{children:e("div",{children:[e("div",{class:"row",children:[e("div",{class:"column",children:[e("h2",{children:"\u8A2D\u5B9A"}),e("p",{children:"\u6BCF\u9031\u4E0A\u8AB2\u5929\u6578"}),e("select",{onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_RAuh0bYmX0o"),children:[e("option",{value:1,children:"1"}),e("option",{value:2,children:"2"}),e("option",{value:3,children:"3"}),e("option",{value:4,children:"4"}),e("option",{selected:!0,value:5,children:"5"}),e("option",{value:6,children:"6"}),e("option",{value:7,children:"7"})]}),e("hr",{}),e("p",{children:"\u6BCF\u5929\u4E0A\u8AB2\u7BC0\u6578"}),e("select",{onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_8SYEdfSgR0o"),children:[e("option",{value:1,children:"1"}),e("option",{value:2,children:"2"}),e("option",{value:3,children:"3"}),e("option",{value:4,children:"4"}),e("option",{value:5,children:"5"}),e("option",{value:6,children:"6"}),e("option",{selected:!0,value:7,children:"7"}),e("option",{value:8,children:"8"}),e("option",{value:9,children:"9"}),e("option",{value:10,children:"10"})]}),e("hr",{}),e("p",{children:"N \u89D2\u8ABF\u8AB2"}),e("select",{onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_hymY9g0I8DM",[t]),children:[e("option",{value:1,children:"1"}),e("option",{selected:!0,value:2,children:"2"}),e("option",{value:3,children:"3"}),e("option",{value:4,children:"4"})]}),e("hr",{}),e("p",{children:"\u8ACB\u9078\u64C7\u6A94\u6848"}),e("input",{type:"file",id:"input",accept:"text",multiple:!0,onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_JokdLhx0Uys")}),e("hr",{}),e("p",{children:"\u8ACB\u9078\u64C7\u8001\u5E2B"}),e("select",{size:5,id:"s",onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_nSt08jdyBiM",[t])}),e("hr",{}),e("p",{children:"\u8ACB\u9078\u64C7\u7D50\u679C"}),e("select",{size:5,id:"ss",onChange$:i(()=>c(()=>Promise.resolve().then(()=>a),void 0),"s_Za7bEZKGMQU",[t])})]}),e("div",{class:"column",children:[e("p",{children:"\u539F\u8AB2\u8868"}),e("table",{id:"originTable"}),e("p",{children:"\u8ABF\u8AB2\u5F8C\u8AB2\u8868"}),e("table",{id:"toTable"})]})]}),e("p",{children:["index: ",E(t,"index")]}),e("p",{children:["sols: ",E(t,"sol")]})]})})},A=t=>{const[n]=f();_();const s=t.target.value;n.steps=+s},M=t=>{_();const n=t.target.value;p.setCourses(+n)},O=`table,th,td{border:1px solid black;border-collapse:collapse}table{width:100%}td{flex:1}td,div,p{text-align:center;vertical-align:middle}select{width:100px}.row{display:flex}.column{flex:50%}
`,C=O,$=t=>{_();const n=t.target.value;p.setDays(+n)},a=Object.freeze(Object.defineProperty({__proto__:null,s_Za7bEZKGMQU:w,s_nSt08jdyBiM:D,s_JokdLhx0Uys:R,s_xYL1qOwPyDI:j,s_hymY9g0I8DM:A,s_8SYEdfSgR0o:M,s_6r9BnBnj0sQ:C,s_RAuh0bYmX0o:$},Symbol.toStringTag,{value:"Module"}));export{C as s_6r9BnBnj0sQ,M as s_8SYEdfSgR0o,R as s_JokdLhx0Uys,$ as s_RAuh0bYmX0o,w as s_Za7bEZKGMQU,A as s_hymY9g0I8DM,D as s_nSt08jdyBiM,j as s_xYL1qOwPyDI};

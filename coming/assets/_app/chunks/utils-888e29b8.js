import"./vendor-d832f65a.js";import{e}from"./stores-71f40619.js";import{r as s}from"./singletons-bb9012b7.js";const t=async function(e,t){return s.goto(e,t,[])};const o=e=>(e/1e8).toFixed(8),a=e=>{let s=document.createElement("textarea");s.style.position="fixed",s.value=e,document.body.appendChild(s),s.focus(),s.select(),document.execCommand("copy"),document.body.removeChild(s)},r=s=>{if(!s)return e.set(s);"string"==typeof s&&(s={message:s});let t=s.message;try{t=JSON.parse(t).message}catch{}try{t=JSON.parse(t).message}catch{}t||(t="An error occurred"),e.set(t),s.stack&&console.log(s.stack)},c=e=>setTimeout((()=>e.focus()),50),n=e=>t(e,{noscroll:!0});export{t as a,o as b,a as c,r as e,c as f,n as g};
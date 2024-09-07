(()=>{var te=Object.create;var F=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var se=Object.getPrototypeOf,ae=Object.prototype.hasOwnProperty;var ne=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var ie=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of oe(e))!ae.call(s,o)&&o!==t&&F(s,o,{get:()=>e[o],enumerable:!(r=re(e,o))||r.enumerable});return s};var ce=(s,e,t)=>(t=s!=null?te(se(s)):{},ie(e||!s||!s.__esModule?F(t,"default",{value:s,enumerable:!0}):t,s));var J=ne((Pe,v)=>{"use strict";var u={decodeValues:!0,map:!1,silent:!1};function z(s){return typeof s=="string"&&!!s.trim()}function A(s,e){var t=s.split(";").filter(z),r=t.shift(),o=ve(r),i=o.name,n=o.value;e=e?Object.assign({},u,e):u;try{n=e.decodeValues?decodeURIComponent(n):n}catch(d){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+n+"'. Set options.decodeValues to false to disable this feature.",d)}var a={name:i,value:n};return t.forEach(function(d){var l=d.split("="),p=l.shift().trimLeft().toLowerCase(),h=l.join("=");p==="expires"?a.expires=new Date(h):p==="max-age"?a.maxAge=parseInt(h,10):p==="secure"?a.secure=!0:p==="httponly"?a.httpOnly=!0:p==="samesite"?a.sameSite=h:a[p]=h}),a}function ve(s){var e="",t="",r=s.split("=");return r.length>1?(e=r.shift(),t=r.join("=")):t=s,{name:e,value:t}}function V(s,e){if(e=e?Object.assign({},u,e):u,!s)return e.map?{}:[];if(s.headers)if(typeof s.headers.getSetCookie=="function")s=s.headers.getSetCookie();else if(s.headers["set-cookie"])s=s.headers["set-cookie"];else{var t=s.headers[Object.keys(s.headers).find(function(o){return o.toLowerCase()==="set-cookie"})];!t&&s.headers.cookie&&!e.silent&&console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),s=t}if(Array.isArray(s)||(s=[s]),e=e?Object.assign({},u,e):u,e.map){var r={};return s.filter(z).reduce(function(o,i){var n=A(i,e);return o[n.name]=n,o},r)}else return s.filter(z).map(function(o){return A(o,e)})}function ke(s){if(Array.isArray(s))return s;if(typeof s!="string")return[];var e=[],t=0,r,o,i,n,a;function d(){for(;t<s.length&&/\s/.test(s.charAt(t));)t+=1;return t<s.length}function l(){return o=s.charAt(t),o!=="="&&o!==";"&&o!==","}for(;t<s.length;){for(r=t,a=!1;d();)if(o=s.charAt(t),o===","){for(i=t,t+=1,d(),n=t;t<s.length&&l();)t+=1;t<s.length&&s.charAt(t)==="="?(a=!0,t=n,e.push(s.substring(r,i)),r=t):t=i+1}else t+=1;(!a||t>=s.length)&&e.push(s.substring(r,s.length))}return e}v.exports=V;v.exports.parse=V;v.exports.parseString=A;v.exports.splitCookiesString=ke});var le=globalThis.fetch,w=globalThis.WebSocket,de=globalThis.Request,O=globalThis.Response,E=globalThis.SharedWorker,U=globalThis.localStorage,pe=globalThis.navigator.serviceWorker,b={prototype:{send:w.prototype.send},CLOSED:w.CLOSED,CLOSING:w.CLOSING,CONNECTING:w.CONNECTING,OPEN:w.OPEN};async function P(){let e=(await self.clients.matchAll({type:"window",includeUncontrolled:!0})).map(async r=>{let o=await he(r);return await B(o),o}),t=Promise.race([Promise.any(e),new Promise((r,o)=>setTimeout(o,1e3,new TypeError("timeout")))]);try{return await t}catch(r){if(r instanceof AggregateError)throw console.error("bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort."),new Error("All clients returned an invalid MessagePort.");return console.warn("bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying"),await P()}}function he(s){let e=new MessageChannel;return new Promise(t=>{s.postMessage({type:"getPort",port:e.port2},[e.port2]),e.port1.onmessage=r=>{t(r.data)}})}function B(s){let e=new MessageChannel,t=new Promise((r,o)=>{e.port1.onmessage=i=>{i.data.type==="pong"&&r()},setTimeout(o,1500)});return s.postMessage({message:{type:"ping"},port:e.port2},[e.port2]),t}function I(s,e){let t=new E(s,"bare-mux-worker");return e&&pe.addEventListener("message",r=>{if(r.data.type==="getPort"&&r.data.port){console.debug("bare-mux: recieved request for port from sw");let o=new E(s,"bare-mux-worker");r.data.port.postMessage(o.port,[o.port])}}),t.port}var R=class{constructor(e){this.channel=new BroadcastChannel("bare-mux"),e instanceof MessagePort?this.port=e:this.createChannel(e,!0)}createChannel(e,t){if(self.clients)this.port=P(),this.channel.onmessage=r=>{r.data.type==="refreshPort"&&(this.port=P())};else if(e&&E){if(!e.startsWith("/")&&!e.includes("://"))throw new Error("Invalid URL. Must be absolute or start at the root.");this.port=I(e,t),console.debug("bare-mux: setting localStorage bare-mux-path to",e),U["bare-mux-path"]=e}else if(E){let r=U["bare-mux-path"];if(console.debug("bare-mux: got localStorage bare-mux-path:",r),!r)throw new Error("Unable to get bare-mux workerPath from localStorage.");this.port=I(r,t)}else throw new Error("Unable to get a channel to the SharedWorker.")}async sendMessage(e,t){this.port instanceof Promise&&(this.port=await this.port);try{await B(this.port)}catch{return console.warn("bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead."),this.createChannel(),await this.sendMessage(e,t)}let r=new MessageChannel,o=[r.port2,...t||[]],i=new Promise((n,a)=>{r.port1.onmessage=d=>{let l=d.data;l.type==="error"?a(l.error):n(l)}});return this.port.postMessage({message:e,port:r.port2},o),await i}},we="!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";function ge(s){for(let e=0;e<s.length;e++){let t=s[e];if(!we.includes(t))return!1}return!0}var fe=["ws:","wss:"],ue=[101,204,205,304],me=[301,302,303,307,308];var S=class{constructor(e){this.worker=new R(e)}createWebSocket(e,t=[],r,o,i){try{e=new URL(e)}catch{throw new DOMException(`Faiiled to construct 'WebSocket': The URL '${e}' is invalid.`)}if(!fe.includes(e.protocol))throw new DOMException(`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${e.protocol}' is not allowed.`);Array.isArray(t)||(t=[t]),t=t.map(String);for(let c of t)if(!ge(c))throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${c}' is invalid.`);let n=r||w,a=new n("ws://127.0.0.1:1",t),d="",l=b.CONNECTING,p=!1;a.addEventListener("error",c=>{p||(l=w.CONNECTING,c.stopImmediatePropagation(),p=!0)});let h=!1;a.addEventListener("close",c=>{h||(c.stopImmediatePropagation(),h=!0)}),i=i||n.constructor.constructor("return ArrayBuffer")().prototype,o=o||{},o.Host=new URL(e).host,o.Pragma="no-cache",o["Cache-Control"]="no-cache",o.Upgrade="websocket",o.Connection="Upgrade";let k=c=>{l=b.OPEN,d=c,a.meta={headers:{"sec-websocket-protocol":c}},a.dispatchEvent(new Event("open"))},X=async c=>{typeof c=="string"?a.dispatchEvent(new MessageEvent("message",{data:c})):"byteLength"in c?(a.binaryType==="blob"?c=new Blob([c]):Object.setPrototypeOf(c,i),a.dispatchEvent(new MessageEvent("message",{data:c}))):"arrayBuffer"in c&&(a.binaryType==="arraybuffer"&&(c=await c.arrayBuffer(),Object.setPrototypeOf(c,i)),a.dispatchEvent(new MessageEvent("message",{data:c})))},Z=(c,g)=>{l=b.CLOSED,a.dispatchEvent(new CloseEvent("close",{code:c,reason:g}))},q=()=>{l=b.CLOSED,a.dispatchEvent(new Event("error"))},m=new MessageChannel;m.port1.onmessage=c=>{c.data.type==="open"?k(c.data.args[0]):c.data.type==="message"?X(c.data.args[0]):c.data.type==="close"?Z(c.data.args[0],c.data.args[1]):c.data.type==="error"&&q()},this.worker.sendMessage({type:"websocket",websocket:{url:e.toString(),origin,protocols:t,requestHeaders:o,channel:m.port2}},[m.port2]);let D=()=>l;Object.defineProperty(a,"readyState",{get:D,configurable:!0,enumerable:!0});let ee=()=>{if(D()===b.CONNECTING)return new DOMException("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.")};return a.send=function(...c){let g=ee();if(g)throw g;let f=c[0];f.buffer&&(f=f.buffer),m.port1.postMessage({type:"data",data:f},f instanceof ArrayBuffer?[f]:[])},a.close=function(c,g){m.port1.postMessage({type:"close",closeCode:c,closeReason:g})},Object.defineProperty(a,"url",{get:()=>e.toString(),configurable:!0,enumerable:!0}),Object.defineProperty(a,"protocol",{get:()=>d,configurable:!0,enumerable:!0}),a}async fetch(e,t){let r=new de(e,t),o=t?.headers||r.headers,i=o instanceof Headers?Object.fromEntries(o):o,n=r.body,a=new URL(r.url);if(a.protocol.startsWith("blob:")){let d=await le(a),l=new O(d.body,d);return l.rawHeaders=Object.fromEntries(d.headers),l.rawResponse=d,l}for(let d=0;;d++){"host"in i?i.host=a.host:i.Host=a.host;let l=(await this.worker.sendMessage({type:"fetch",fetch:{remote:a.toString(),method:r.method,headers:i,body:n||void 0}},n?[n]:[])).fetch,p=new O(ue.includes(l.status)?void 0:l.body,{headers:new Headers(l.headers),status:l.status,statusText:l.statusText});p.rawHeaders=l.headers,p.rawResponse=new O(l.body),p.finalURL=a.toString();let h=t?.redirect||r.redirect;if(me.includes(p.status))switch(h){case"follow":{let k=p.headers.get("location");if(20>d&&k!==null){a=new URL(k,a);continue}else throw new TypeError("Failed to fetch")}case"error":throw new TypeError("Failed to fetch");case"manual":return p}else return p}}};var G="1.0.6-patch.1";var{assign:j}=Object,N="entries",C="readonly",L="readwrite",$={durability:"default",prefix:"IDBMap"},y=({target:{result:s}})=>s,x=class extends EventTarget{#t;#o;#r;async#e(e,t){let o=(await this.#t).transaction(N,t,this.#o);return new Promise((i,n)=>j(e(o.objectStore(N)),{onsuccess:i,onerror:n}))}constructor(e,{durability:t=$.durability,prefix:r=$.prefix}=$){super(),this.#r=r,this.#o={durability:t},this.#t=new Promise((o,i)=>{j(indexedDB.open(`${this.#r}/${e}`),{onupgradeneeded({target:{result:n,transaction:a}}){n.objectStoreNames.length||n.createObjectStore(N),a.oncomplete=()=>o(n)},onsuccess(n){o(y(n))},onerror(n){i(n),this.dispatchEvent(n)}})}).then(o=>{let i=this.dispatchEvent.bind(this);for(let n in o)n.startsWith("on")&&(o[n]=i);return o})}dispatchEvent(e){let{type:t,message:r,isTrusted:o}=e;return super.dispatchEvent(o?j(new Event(t),{message:r}):e)}async close(){(await this.#t).close()}get size(){return this.#e(e=>e.count(),C).then(y)}async clear(){await this.#e(e=>e.clear(),L)}async delete(e){await this.#e(t=>t.delete(e),L)}async entries(){let e=await this.keys();return Promise.all(e.map(t=>this.get(t).then(r=>[t,r])))}async forEach(e,t=this){for(let[r,o]of await this.entries())await e.call(t,o,r,this)}async get(e){return await this.#e(r=>r.get(e),C).then(y)}async has(e){return await this.#e(r=>r.getKey(e),C).then(y)!==void 0}async keys(){return await this.#e(t=>t.getAllKeys(),C).then(y)}async set(e,t){return await this.#e(r=>r.put(t,e),L),this}async values(){let e=await this.keys();return Promise.all(e.map(t=>this.get(t)))}get[Symbol.toStringTag](){return this.#r}};var T=/^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;function H(s,e,t){let r=t||{},o=r.encode||xe;if(typeof o!="function")throw new TypeError("option encode is invalid");if(!T.test(s))throw new TypeError("argument name is invalid");let i=o(e);if(i&&!T.test(i))throw new TypeError("argument val is invalid");let n=s+"="+i;if(r.maxAge!==void 0&&r.maxAge!==null){let a=r.maxAge-0;if(Number.isNaN(a)||!Number.isFinite(a))throw new TypeError("option maxAge is invalid");n+="; Max-Age="+Math.floor(a)}if(r.domain){if(!T.test(r.domain))throw new TypeError("option domain is invalid");n+="; Domain="+r.domain}if(r.path){if(!T.test(r.path))throw new TypeError("option path is invalid");n+="; Path="+r.path}if(r.expires){if(!ye(r.expires)||Number.isNaN(r.expires.valueOf()))throw new TypeError("option expires is invalid");n+="; Expires="+r.expires.toUTCString()}if(r.httpOnly&&(n+="; HttpOnly"),r.secure&&(n+="; Secure"),r.priority)switch(typeof r.priority=="string"?r.priority.toLowerCase():r.priority){case"low":{n+="; Priority=Low";break}case"medium":{n+="; Priority=Medium";break}case"high":{n+="; Priority=High";break}default:throw new TypeError("option priority is invalid")}if(r.sameSite)switch(typeof r.sameSite=="string"?r.sameSite.toLowerCase():r.sameSite){case!0:{n+="; SameSite=Strict";break}case"lax":{n+="; SameSite=Lax";break}case"strict":{n+="; SameSite=Strict";break}case"none":{n+="; SameSite=None";break}default:throw new TypeError("option sameSite is invalid")}return r.partitioned&&(n+="; Partitioned"),n}function ye(s){return Object.prototype.toString.call(s)==="[object Date]"||s instanceof Date}function xe(s){return encodeURIComponent(s)}var K=ce(J(),1),M=new x("cookies");async function Y(s){let e=new Date,t=[];for(let o of await M.keys())if(o.startsWith(`${s}@`)){let i=!1,n=await M.get(o);n.maxAge?i=n.set.getTime()+n.maxAge*1e3<e:n.expires&&(i=new Date(n.expires.toLocaleString())<e),i?await M.delete(o):t.push(n)}return t.map(o=>H(o.name,o.value,o))}async function _(s,e){let t=(0,K.parse)(s);for(let r of t)await M.set(`${e}@${r.name}`,r.value)}var Q=`
a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}dialog,fieldset,legend,menu,ol,ul{padding:0}*,::after,::before{box-sizing:border-box;border:0 solid #e5e7eb;--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{line-height:inherit}hr{height:0;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.mx-auto{margin-left:auto;margin-right:auto}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.h-12{height:3rem}.min-h-[100dvh]{min-height:100dvh}.w-12{width:3rem}.max-w-md{max-width:28rem}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.overflow-x-scroll{overflow-x:scroll}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-2{border-width:2px}.border-gray-800{--tw-border-opacity:1;border-color:rgb(31 41 55 / var(--tw-border-opacity))}.border-transparent{border-color:transparent}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-800,.hover:bg-gray-800:hover{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}.bg-gray-900,.hover:bg-gray-900:hover{--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.stroke-red-400{stroke:#f87171}.p-1.5{padding:.375rem}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.py-12{padding-top:3rem;padding-bottom:3rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.text-left{text-align:left}.text-center{text-align:center}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.tracking-tight{letter-spacing:-.025em}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}.hover:text-white:hover,.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}@media (min-width:640px){.sm:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm:text-4xl{font-size:2.25rem;line-height:2.5rem}}@media (min-width:1024px){.lg:px-8{padding-left:2rem;padding-right:2rem}}`;var W=class{client;constructor(){this.client=new S}shouldRoute({request:e}){return e.url.startsWith(location.origin+self.$meteor.config.prefix)}async handleFetch({request:e}){try{let t=new URL(self.$meteor.rewrite.url.decode(e.url));self.$meteor.util.log(`Processing request for ${t.href}`);for(let a of self.$meteor.config.plugins)a.filter.test(t.href)&&self.$meteor.util.log(`Plugin ${a.name} loaded for this page`,"teal");if(t.href.startsWith("data:")){let a=await fetch(t);return new Response(a.body)}let r=new Headers(e.headers);r.set("cookie",(await Y(t.host)).join("; ")),r.set("host",t.host),r.set("origin",t.origin);let o=await this.client.fetch(t,{method:e.method,body:e.body,headers:r,credentials:"omit",mode:e.mode==="cors"?e.mode:"same-origin",cache:e.cache,redirect:e.redirect,duplex:"half"}),i,n=self.$meteor.rewrite.headers(o.headers,t);if(await _(o.rawHeaders["set-cookie"],t.host),o.body)switch(e.destination){case"iframe":case"frame":case"document":o.headers.get("content-type")?.includes("text/html")?i=self.$meteor.rewrite.html(await o.text(),t):i=o.body;break;case"style":i=self.$meteor.rewrite.css(await o.text(),t);break;case"worker":case"sharedworker":case"script":i=self.$meteor.rewrite.js(await o.text(),t);break;default:i=o.body}if(["document","iframe"].includes(e.destination)){let a=o.headers.get("content-disposition");if(!/\s*?((inline|attachment);\s*?)filename=/i.test(a)){let d=/^\s*?attachment/i.test(a)?"attachment":"inline",[l]=o.finalURL.split("/").reverse();o.headers.set("Content-Disposition",`${d}; filename=${JSON.stringify(l)}`)}}for(let a of self.$meteor.config.plugins)a.filter.test(t.href)&&"onRequest"in a&&(self.$meteor.util.log(`Running onRequest for ${a.name}`,"teal"),o=await a.onRequest(o));return new Response(i,{headers:n,status:o.status,statusText:o.statusText})}catch(t){self.$meteor.util.log(t,"#FF5757");let r=self.$meteor.rewrite.url.decode(e.url);return this.renderError(t,r,G)}}renderError(e,t,r){return new Response(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Something went wrong</title>
            <!-- generated with https://play.tailwindcss.com/ -->
            <style>${Q}</style>
          </head>
          <body>
            <div class="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
              <div class="mx-auto max-w-md text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  class="mx-auto h-12 w-12 stroke-red-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  ></path>
                </svg>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Something went wrong
                </h1>
                <p class="mt-4 text-gray-500">
                  Meteor ran into an error while processing your request.
                </p>
                <div class="mt-6 space-y-4">
                  <p class="mt-4 text-gray-500 text-left">URL: <span class="p-1.5 px-2 bg-gray-100 font-mono text-sm rounded-md">${t}</span></p>
                  <p class="mt-4 text-gray-500 text-left">Version: <span class="p-1.5 px-2 bg-gray-100 font-mono text-sm rounded-md">${r}</span></p>
                  <pre class="rounded-md bg-gray-100 p-4 text-left text-sm text-gray-500 overflow-x-scroll">${e}</pre>
                  <div class="flex space-x-2">
                    <button onclick="window.location.reload()" class="rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 flex-1 transition-all">
                      Reload Page
                    </button>
                    <a href="https://github.com/meteorproxy/meteor/issues/new" target="_blank" class="rounded-md border-2 border-gray-800 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-800 hover:text-white flex-1 transition-all">
                      Report Error
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,{status:500,headers:{"Content-Type":"text/html"}})}};self.MeteorServiceWorker=W;})();
//# sourceMappingURL=meteor.worker.js.map
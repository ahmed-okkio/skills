// usage: node selftest.js <page.html> [WxH]   prints the page's ?selftest report; exit 1 on FAIL
//
// Drives headless Chrome/Edge over the DevTools protocol (Node 22+ global WebSocket), because
// `--dump-dom` prints nothing on Windows: the browser is a GUI-subsystem exe and its stdout is lost.
const {spawn}=require("child_process"),fs=require("fs"),os=require("os"),path=require("path"),url=require("url");
const [page,size="1440x900"]=process.argv.slice(2);
if(!page)throw new Error("usage: node selftest.js <page.html> [WxH]");
const CANDIDATES=[process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome","/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome","/usr/bin/chromium","/usr/bin/chromium-browser","/usr/bin/microsoft-edge"];
const exe=CANDIDATES.find(p=>p&&fs.existsSync(p));
if(!exe){console.log("SKIPPED: no Chrome/Edge found (set CHROME=<path>)");process.exit(2);}
const prof=fs.mkdtempSync(path.join(os.tmpdir(),"mk-st-"));
const port=9300+Math.floor(Math.random()*500);
const target=url.pathToFileURL(path.resolve(page)).href+"?selftest";
const br=spawn(exe,["--headless=new","--disable-gpu","--no-first-run","--user-data-dir="+prof,
  "--remote-debugging-port="+port,"--window-size="+size.replace("x",","),target],{stdio:"ignore"});
const done=(msg,code)=>{console.log(msg);br.kill();setTimeout(()=>{try{fs.rmSync(prof,{recursive:true,force:true})}catch{}process.exit(code)},300);};
const errs=[];
setTimeout(()=>done("FAIL: no selftest report within 30s"+(errs.length?"; page errors:\n"+errs.join("\n"):""),1),30000);

(async()=>{
  let ws;
  for(let i=0;i<100&&!ws;i++){
    try{const t=(await (await fetch("http://127.0.0.1:"+port+"/json")).json()).find(t=>t.type==="page");
        if(t)ws=t.webSocketDebuggerUrl;}catch{}
    if(!ws)await new Promise(r=>setTimeout(r,200));
  }
  if(!ws)return done("FAIL: browser did not open a debugging port",1);
  const sock=new WebSocket(ws);let id=0;const wait={};
  sock.onmessage=e=>{const m=JSON.parse(e.data);
    if(m.method==="Runtime.exceptionThrown"){const d=m.params.exceptionDetails;errs.push((d.exception&&d.exception.description||d.text).split("\n")[0]+" (line "+d.lineNumber+")");}
    if(wait[m.id]){wait[m.id](m.result);delete wait[m.id];}};
  await new Promise(r=>sock.onopen=r);
  const ev=expr=>new Promise(r=>{wait[++id]=r;sock.send(JSON.stringify({id,method:"Runtime.evaluate",params:{expression:expr,returnByValue:true}}));});
  sock.send(JSON.stringify({id:++id,method:"Runtime.enable"}));
  sock.send(JSON.stringify({id:++id,method:"Page.reload"})); // so errors thrown during the first load are captured
  for(;;){
    const r=await ev('(function(){var e=document.getElementById("selftest");return e&&/\\b(pass|fail)\\b/.test(e.className)?e.className+"\\n"+e.innerText:""})()');
    const v=r&&r.result&&r.result.value;
    if(v)return done(v.replace(/^[^\n]*\n/,""),/\bfail\b/.test(v.split("\n")[0])?1:0);
    await new Promise(r=>setTimeout(r,250));
  }
})();

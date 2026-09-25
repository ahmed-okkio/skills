// usage: node spec-doc.js <shell page.html> <out.html>
//
// Turns a finished shell page into the read-only spec DOCUMENT. Same <style>, same builders,
// same MOCKUP — only the picker chrome is dropped: no state or viewport toggle, no deck, no rail,
// no picking, no compare-with-today, no picks panel. A reader who cannot choose anything must
// not be shown controls that invite them to.
//
// It keeps a hidden #footblock, so a page that appends its own sections on DOMContentLoaded
// (insertBefore #footblock — the usual pattern for code changes / capability accounting /
// open questions) keeps working untouched.
//
// Optional, read off MOCKUP if present:
//   MOCKUP.spec.subtitle      one line under the title (project, item id, "for sign-off")
//   MOCKUP.spec.note(stateId) -> {title, reached, keyboard}  the caption for that state
//   MOCKUP.spec.opts          the option ids passed to renderSurface (default: MOCKUP.today)
// Without them the caption falls back to the state's own label.
const fs=require("fs");
const [inF,outF]=process.argv.slice(2);
if(!inF||!outF)throw new Error("usage: node spec-doc.js <shell page.html> <out.html>");
let s=fs.readFileSync(inF,"utf8");
const bodyI=s.indexOf("<body>");                 if(bodyI<0)throw new Error("no <body>");
const aEnd=s.indexOf("</script>",bodyI);         if(aEnd<0)throw new Error("no builders script");
const bStart=s.lastIndexOf("<script>");
if(bStart<aEnd)throw new Error("the shell's viewer script was not found after the builders");
const head=s.slice(0,aEnd+"</script>".length);

const CSS=`
<style>
/* the document owns its own layout: the shell's chrome is gone. Same light table, same
   three faces, so the sign-off reads as the last page of the same set. Ochre appears
   once: the state tag on each figure — the frames here are all "picked". */
html,body{background:#D5D8DC;color:#15181D}
/* the shell is a slide deck (html,body{height:100%} + body{overflow:hidden;display:flex});
   a DOCUMENT must scroll, so reset those three before anything else or everything past the
   first viewport is unreachable. */
html,body{height:auto;overflow:visible}
body{display:block}
body{font-family:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;margin:0;padding:0;-webkit-font-smoothing:antialiased}
.doc{max-width:1040px;margin:0 auto;padding:38px 28px 90px}
/* every document rule excludes .doc-shot descendants: the mock inside a figure keeps its
   own h2 / .sub / table styling (a ".doc .sub" rule once uppercased a mock's timestamps) */
.doc h1:not(.doc-shot *){font-family:Bahnschrift,"DIN Alternate","Avenir Next Condensed","Arial Narrow",system-ui,sans-serif;font-stretch:87.5%;
  font-size:28px;font-weight:600;margin:0 0 6px;letter-spacing:-.005em;line-height:1.15}
#docsub{font-family:"Cascadia Mono",Consolas,ui-monospace,monospace;font-size:10.5px;color:#79818C;margin:0 0 22px;letter-spacing:.14em;text-transform:uppercase}
#docintro{font-size:14px;line-height:1.6;color:#4B535E;margin:0 0 30px;max-width:70ch}
.doc h2:not(.doc-shot *){font-family:Bahnschrift,"DIN Alternate","Avenir Next Condensed","Arial Narrow",system-ui,sans-serif;font-stretch:87.5%;
  font-size:18px;font-weight:600;margin:44px 0 6px;border-top:3px solid #B9BEC5;padding-top:14px}
.doc-fig{margin:0 0 34px;background:#F3F4F6;border:1px solid #B9BEC5;border-radius:6px;padding:12px 12px 14px}
.doc-fig .cap{display:flex;gap:10px;align-items:baseline;margin:0 0 10px}
.doc-fig .cap b{font-family:Bahnschrift,"DIN Alternate","Avenir Next Condensed","Arial Narrow",system-ui,sans-serif;font-stretch:87.5%;
  font-size:15px;font-weight:600}
.doc-fig .cap .st{font:10.5px/1 "Cascadia Mono",Consolas,ui-monospace,monospace;color:#7A5300;border:1px solid #B87D00;
  border-radius:3px;padding:3px 6px;text-transform:uppercase;letter-spacing:.12em}
.doc-shot{border:1px solid #B9BEC5;border-radius:3px;overflow:hidden;position:relative;background:#fff}
.doc-shot > .lp,.doc-shot > .docsurf{position:absolute;top:0;left:0;transform-origin:top left}
.doc-note{font-size:13px;line-height:1.6;color:#4B535E;margin:10px 0 0}
.doc-note.k{color:#79818C;font-family:"Cascadia Mono",Consolas,ui-monospace,monospace;font-size:12px}
.doc code:not(.doc-shot *),.doc kbd:not(.doc-shot *){font-family:"Cascadia Mono",Consolas,ui-monospace,monospace;font-size:12px}
.doc table:not(.doc-shot *){border-collapse:collapse;width:100%;font-size:13px}
.doc th:not(.doc-shot *){text-align:left;font-family:"Cascadia Mono",Consolas,ui-monospace,monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:#79818C;padding:6px 8px;border-bottom:1px solid #B9BEC5}
.doc td:not(.doc-shot *){padding:6px 8px;border-bottom:1px solid #E6E8EB;vertical-align:top}
#footblock{display:none}
.ds-sec,.spec-sec{margin-top:44px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
</style>`;

const JS=`
<script>
(function(){
  var SP=MOCKUP.spec||{}, S=MOCKUP.surface;
  var opts=SP.opts||MOCKUP.today||{};
  var VPL=(MOCKUP.viewports&&MOCKUP.viewports.length)?MOCKUP.viewports:[null];
  document.getElementById("doctitle").textContent=MOCKUP.title||"";
  document.getElementById("docintro").textContent=MOCKUP.intro||"";
  if(SP.subtitle)document.getElementById("docsub").textContent=SP.subtitle;
  var wrap=document.getElementById("docstates");
  /* one figure per state per declared viewport, so the sign-off shows every form factor */
  for(var v=0;v<VPL.length;v++){
    var vp=VPL[v], W0=vp?vp.w:S.w, H0=vp?vp.h:S.h;
    var SC=1040/W0>1?1:(1010/W0), W=Math.round(W0*SC), H=Math.round(H0*SC);
    for(var i=0;i<MOCKUP.states.length;i++){
      var st=MOCKUP.states[i], n=(SP.note&&SP.note(st.id))||{};
      var f=document.createElement("div");f.className="doc-fig";
      f.innerHTML='<div class="cap"><span class="st"></span><b></b></div>'+
        '<div class="doc-shot" style="width:'+W+'px;height:'+H+'px"></div>'+
        '<p class="doc-note"></p><p class="doc-note k"></p>';
      f.querySelector(".st").textContent=st.id+(vp?" · "+vp.label:"");
      f.querySelector("b").textContent=n.title||st.label||st.id;
      f.querySelectorAll(".doc-note")[0].textContent=n.reached||"";
      f.querySelectorAll(".doc-note")[1].textContent=n.keyboard||"";
      wrap.appendChild(f);
      var shot=f.querySelector(".doc-shot");
      shot.innerHTML=MOCKUP.renderSurface(opts,st.id,"doc",null,vp?vp.id:null);
      var inner=shot.firstElementChild;
      if(inner){inner.style.width=W0+"px";inner.style.height=H0+"px";inner.style.transform="scale("+SC+")";
        inner.style.position="absolute";inner.style.transformOrigin="top left";}
    }
  }
})();
</script>`;

fs.writeFileSync(outF,head+`
${CSS}
<div class="doc">
  <h1 id="doctitle"></h1>
  <p class="sub" id="docsub">agreed design, for sign-off</p>
  <p class="lede" id="docintro"></p>
  <h2>Every state of the surface</h2>
  <div id="docstates"></div>
  <div id="footblock"></div>
</div>
${JS}
</body>
</html>
`,"utf8");
console.log("written "+outF+" "+fs.statSync(outF).size+" bytes");

// usage: node build.js <out-dir>                       write <out-dir>/tokens.css + data.js (the demo, to edit)
//        node build.js <tokens.css> <data.js> <out.html>  splice them into a copy of shell.html
//
// The two author-owned regions of shell.html are the MOCK TOKENS CSS block and the AUTHOR DATA
// BLOCK script. A mockup agent writes only those two files and never reads or rewrites the rest of
// the shell: the page it gets is the shell byte-for-byte except those regions. The shell's own
// header comment is the data contract; the first form prints it to stdout.
const fs=require("fs"),path=require("path");
const SHELL=path.join(__dirname,"shell.html");
const s=fs.readFileSync(SHELL,"utf8");

function region(startMark,endMark,includeEnd){
  const a=s.indexOf(startMark); if(a<0)throw new Error("shell marker not found: "+startMark);
  const b=s.indexOf(endMark,a); if(b<0)throw new Error("shell marker not found: "+endMark);
  return [a, includeEnd? b+endMark.length : b];
}
const TOK=region("/* ============================ MOCK TOKENS","/* =========================================================================\n   SHELL — DO NOT EDIT",false);
const DAT=region("/* ============================================================================\n   AUTHOR DATA BLOCK","/* ====================== END AUTHOR DATA BLOCK ====================== */",true);

const args=process.argv.slice(2);
if(args.length===1){
  const dir=args[0]; fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"tokens.css"),s.slice(TOK[0],TOK[1]));
  fs.writeFileSync(path.join(dir,"data.js"),s.slice(DAT[0],DAT[1])+"\n");
  const c=s.indexOf("<!--"),e=s.indexOf("-->",c);
  process.stdout.write(s.slice(c,e+3)+"\n");
}else if(args.length===3){
  const [tokF,datF,outF]=args;
  const tok=fs.readFileSync(tokF,"utf8").replace(/\s*$/,"\n\n");
  const dat=fs.readFileSync(datF,"utf8").replace(/\s*$/,"");
  if(!/\bvar\s+MOCKUP\s*=/.test(dat))throw new Error(datF+" must define `var MOCKUP={...}`");
  // TOK precedes DAT in the file, so splice the later region first
  let out=s.slice(0,DAT[0])+dat+s.slice(DAT[1]);
  out=out.slice(0,TOK[0])+tok+out.slice(TOK[1]);
  fs.writeFileSync(outF,out);
  console.log("wrote "+outF);
}else{
  throw new Error("usage: node build.js <out-dir>  |  node build.js <tokens.css> <data.js> <out.html>");
}

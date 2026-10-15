const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
function createServer() {
 return http.createServer(async (req,res) => {
  try {
   const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(pathname.includes('\0')) throw new Error('Invalid URL');
   let file = path.resolve(root,'.'+pathname);
   if(file !== root && !file.startsWith(root + path.sep)){res.writeHead(403);res.end();return;}
   const stat = await fs.stat(file);
   if(stat.isDirectory())file=path.join(file,'index.html');
   const bytes = await fs.readFile(file);
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
 });
}
module.exports={createServer};
if(require.main===module){const port=Number(process.env.PORT||8930);createServer().listen(port,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+port));}

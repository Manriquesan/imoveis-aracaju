@echo off
echo ========================================
echo   IMOVEIS ARACAJU - SERVIDOR
echo ========================================
echo.
echo Abrindo servidor em http://localhost:8088
echo Pressione Ctrl+C para parar
echo.
cd "%~dp0"
node -e "const http=require('http');const fs=require('fs');const path=require('path');const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json'};const s=http.createServer((req,res)=>{let fp=path.join(__dirname,req.url==='/'?'index.html':req.url);let ext=path.extname(fp);try{let d=fs.readFileSync(fp);res.writeHead(200,{'Content-Type':mime[ext]||'text/plain'});res.end(d);}catch(e){res.writeHead(404);res.end('Not found');}});s.listen(8088,()=>console.log('Ready at http://localhost:8088')));"

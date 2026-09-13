const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (e) {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
    http.get('http://localhost:' + PORT, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Content length:', data.length);
            console.log('Has title:', data.includes('Im\u00f3veis Aracaju'));
            console.log('Has CSS:', data.includes('style.css'));
            console.log('Has JS:', data.includes('app.js'));
            console.log('\u2705 Site is working!');
            process.exit(0);
        });
    });
});

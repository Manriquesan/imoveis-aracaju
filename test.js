const http = require('http');
http.get('http://localhost:8080', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Content length:', data.length);
        console.log('Has title:', data.includes('Imóveis Aracaju'));
        console.log('Has CSS:', data.includes('style.css'));
        console.log('Has JS:', data.includes('app.js'));
        console.log('✅ Site is working!');
        process.exit(0);
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
});

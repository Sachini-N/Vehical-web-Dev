const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8888;
const WEB_DIR = path.join(__dirname, 'web');
const HTML_FILE = path.join(WEB_DIR, 'index.html');

// Helper: Get local Wi-Fi / LAN IPv4 address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (127.0.0.1) and non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers for mobile devices
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  const currentIP = getLocalIP();

  // Route: /qr - Shows QR Code to easily open on phone
  if (url === '/qr') {
    const targetUrl = `http://${currentIP}:${PORT}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
    const qrPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scan with Phone to Run OBD-II App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
    <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-sky-500/30">
      🚗
    </div>
    <h1 class="text-xl font-bold">OBD-II Vehicle Diagnostic</h1>
    <p class="text-xs text-sky-400 mt-1 font-medium">Scan with Phone Camera to Open</p>
    
    <div class="my-6 p-4 bg-white rounded-2xl shadow-inner">
      <img src="${qrApiUrl}" alt="Scan QR Code" class="w-64 h-64 object-contain rounded-lg" />
    </div>

    <p class="text-xs text-slate-400 mb-2">Or type this address into Chrome / Safari:</p>
    <a href="${targetUrl}" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-sm rounded-xl border border-slate-700 break-all select-all">
      ${targetUrl}
    </a>

    <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
      ⚠️ Ensure your mobile phone is connected to the same Wi-Fi network as this PC.
    </div>
  </div>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(qrPage);
    return;
  }

  // Route: /api/health
  if (url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', ip: currentIP, port: PORT }));
    return;
  }

  // Default: Serve web/index.html
  let filePath = HTML_FILE;
  if (url !== '/' && url !== '/index.html') {
    const candidate = path.join(WEB_DIR, url.replace(/^\//, ''));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      filePath = candidate;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('🚗 OBD-II VEHICLE FAULT DETECTION APP IS RUNNING FOR MOBILE!');
  console.log('================================================================');
  console.log(`📱 Phone URL:  http://${localIP}:${PORT}`);
  console.log(`📷 QR Code:   http://${localIP}:${PORT}/qr`);
  console.log(`💻 Local URL:  http://localhost:${PORT}`);
  console.log('================================================================');
  console.log('👉 Open your phone browser (Chrome/Safari) and go to:');
  console.log(`   http://${localIP}:${PORT}`);
  console.log('================================================================');
});

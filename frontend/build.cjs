// build.cjs - Universal build runner for local and Vercel environments
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inRoot = fs.existsSync(path.join(__dirname, 'frontend'));
const frontendDir = inRoot ? path.join(__dirname, 'frontend') : __dirname;

console.log('[Build] Building frontend in:', frontendDir);

// Run Vite build
const viteBin = path.join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
const nodeBin = process.execPath;

if (fs.existsSync(viteBin)) {
  execSync(`"${nodeBin}" "${viteBin}" build`, { cwd: frontendDir, stdio: 'inherit' });
} else {
  execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });
}

// Ensure build output is available in both root /dist and frontend/dist
const srcDist = path.join(frontendDir, 'dist');
const rootDist = path.join(__dirname, 'dist');

if (inRoot && fs.existsSync(srcDist)) {
  fs.cpSync(srcDist, rootDist, { recursive: true, force: true });
}

console.log('[Build] Frontend build completed successfully!');

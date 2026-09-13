# Deployment Script for Imóveis Aracaju
# Run this in PowerShell

$sitePath = "C:\Users\manri\OneDrive\Documentos\Default Project"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMÓVEIS ARACAJU - DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Option 1: Local Server
Write-Host "Option 1: Local Server" -ForegroundColor Yellow
Write-Host "  Run: serve -s `"$sitePath`" -l 3000" -ForegroundColor White
Write-Host "  Then visit: http://localhost:3000" -ForegroundColor White
Write-Host ""

# Option 2: GitHub Pages
Write-Host "Option 2: GitHub Pages" -ForegroundColor Yellow
Write-Host "  1. Create repo: gh repo create imoveis-aracaju --public" -ForegroundColor White
Write-Host "  2. Push code: git push origin main" -ForegroundColor White
Write-Host "  3. Enable Pages: gh repo edit imoveis-aracaju --source main --build" -ForegroundColor White
Write-Host ""

# Option 3: Netlify
Write-Host "Option 3: Netlify" -ForegroundColor Yellow
Write-Host "  1. npx netlify-cli deploy --prod --dir=$sitePath" -ForegroundColor White
Write-Host "  2. Follow the prompts" -ForegroundColor White
Write-Host ""

Write-Host "Site is ready for deployment!" -ForegroundColor Green
Write-Host "All files are in: $sitePath" -ForegroundColor Green

# Deploy via serve
Write-Host ""
Write-Host "Starting local server..." -ForegroundColor Green
cd $sitePath
serve -s . -l 3000

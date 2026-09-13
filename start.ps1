$sitePath = "C:\Users\manri\OneDrive\Documentos\Default Project"

# Check if serve is installed
$serve = Get-Command serve -ErrorAction SilentlyContinue
if (-not $serve) {
    Write-Host "Installing serve..." -ForegroundColor Yellow
    npm install -g serve
}

# Start the server
Write-Host "Starting server at http://localhost:3000..." -ForegroundColor Green
serve -s $sitePath -l 3000

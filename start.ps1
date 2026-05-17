Write-Host "🚗 MiolaCar Windows Start" -ForegroundColor Cyan

# ── STOP auto-close ─────────────────────────────
$ErrorActionPreference = "Continue"

# ── Check .env ──────────────────────────────────
if (!(Test-Path ".env")) {
    Write-Host "❌ .env manquant !" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# ── SAFE PORT CHECK FUNCTION ────────────────────
function Find-FreePort($port) {
    try {
        while ($true) {
            $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($null -eq $conn) {
                return $port
            }
            $port++
        }
    }
    catch {
        Write-Host "⚠ Erreur scan port $port → $_" -ForegroundColor Yellow
        return $port
    }
}

# ── PORTS (ONLY frontend/backend) ───────────────
$backend = Find-FreePort 8080
$frontend = Find-FreePort 3030

$env:BACKEND_PORT = $backend
$env:FRONTEND_PORT = $frontend

Write-Host "Backend → $backend"
Write-Host "Frontend → $frontend"

# ── DOCKER CHECK ────────────────────────────────
try {
    docker info | Out-Null
}
catch {
    Write-Host "❌ Docker n'est pas démarré !" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# ── CLEAN ────────────────────────────────────────
Write-Host "▶ Nettoyage Docker..." -ForegroundColor Yellow
docker compose down --remove-orphans

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: docker compose down a échoué" -ForegroundColor Yellow
}

# ── START ───────────────────────────────────────
Write-Host "▶ Lancement application..." -ForegroundColor Green

docker compose up --build

# ── KEEP WINDOW OPEN ────────────────────────────
Read-Host "Appuyez sur Entrée pour fermer"
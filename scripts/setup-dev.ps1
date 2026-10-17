# ==========================================================================
# Aroviax — AI Health Companion — Dev Setup (Windows PowerShell)
#
# Sets up the local development environment:
#   1. Checks prerequisites (Node.js, npm, Python)
#   2. Installs Node.js dependencies
#   3. Creates .env from .env.example if missing
#   4. Validates Python tools
#   5. Runs linting and tests
#
# Usage: .\scripts\setup-dev.ps1
# ==========================================================================

$ErrorActionPreference = "Stop"

function Write-Info  { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn  { param($msg) Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Write-Fail  { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗"
Write-Host "║   Aroviax — AI Health Companion — Dev Setup           ║"
Write-Host "╚═══════════════════════════════════════════════════════╝"
Write-Host ""

# --------------------------------------------------------------------------
# 1. Check prerequisites
# --------------------------------------------------------------------------
Write-Host "▶ Checking prerequisites..."

# Node.js
try {
    $nodeVersion = & node --version 2>$null
    Write-Info "Node.js $nodeVersion"
    $major = [int]($nodeVersion -replace 'v' -split '\.')[0]
    if ($major -lt 20) {
        Write-Warn "Node.js v20+ recommended (found $nodeVersion)"
    }
} catch {
    Write-Fail "Node.js not found. Install from https://nodejs.org/"
}

# npm
try {
    $npmVersion = & npm --version 2>$null
    Write-Info "npm $npmVersion"
} catch {
    Write-Fail "npm not found"
}

# Python (optional)
$pythonCmd = $null
try {
    $pyVersion = & python --version 2>&1
    Write-Info $pyVersion
    $pythonCmd = "python"
} catch {
    Write-Warn "Python not found — tools/validate_health_data.py will not be available"
}

Write-Host ""

# --------------------------------------------------------------------------
# 2. Install Node.js dependencies
# --------------------------------------------------------------------------
Write-Host "▶ Installing Node.js dependencies..."

if (Test-Path "node_modules/.package-lock.json") {
    Write-Info "node_modules exists, running npm ci for clean install..."
} else {
    Write-Info "First install, running npm ci..."
}

& npm ci --loglevel=warn
if ($LASTEXITCODE -eq 0) { Write-Info "Dependencies installed" }
else { Write-Warn "npm ci completed with warnings" }

Write-Host ""

# --------------------------------------------------------------------------
# 3. Create .env from template if missing
# --------------------------------------------------------------------------
Write-Host "▶ Checking environment configuration..."

if ((Test-Path ".env") -or (Test-Path ".env.local")) {
    Write-Info ".env file exists"
} else {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Info "Created .env.local from .env.example — edit it with your API keys"
    } else {
        Write-Warn "No .env.example found — create .env.local manually"
    }
}

Write-Host ""

# --------------------------------------------------------------------------
# 4. Validate Python tools
# --------------------------------------------------------------------------
if ($pythonCmd) {
    Write-Host "▶ Validating Python tools..."
    try {
        & $pythonCmd -c "import json, re, sys; print('  Python stdlib OK')" 2>$null
        Write-Info "Python validation tools ready"
    } catch {
        Write-Warn "Python stdlib check failed"
    }
    Write-Host ""
}

# --------------------------------------------------------------------------
# 5. Run linting and tests
# --------------------------------------------------------------------------
Write-Host "▶ Running lint check..."
& npm run lint
if ($LASTEXITCODE -eq 0) { Write-Info "Lint passed" }
else { Write-Warn "Lint issues found" }

Write-Host ""

Write-Host "▶ Running tests..."
& npm test
if ($LASTEXITCODE -eq 0) { Write-Info "All tests passed" }
else { Write-Warn "Some tests failed" }

Write-Host ""

# --------------------------------------------------------------------------
# Done
# --------------------------------------------------------------------------
Write-Host "╔═══════════════════════════════════════════════════════╗"
Write-Host "║   Setup complete!                                     ║"
Write-Host "║                                                       ║"
Write-Host "║   Start dev server:  npm run dev                      ║"
Write-Host "║   Run tests:         npm test                         ║"
Write-Host "║   Production build:  npm run build                    ║"
Write-Host "╚═══════════════════════════════════════════════════════╝"
Write-Host ""

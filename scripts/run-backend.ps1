# ==========================================================================
# Aroviax — Start Python FastAPI AI Backend (Windows PowerShell)
# ==========================================================================
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "Starting Aroviax Python FastAPI AI Backend..." -ForegroundColor Cyan
python backend/run.py

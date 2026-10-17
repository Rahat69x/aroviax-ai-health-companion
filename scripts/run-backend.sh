#!/usr/bin/env bash
# ==========================================================================
# Aroviax — Start Python FastAPI AI Backend (Unix/Linux/macOS)
# ==========================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
echo "Starting Aroviax Python FastAPI AI Backend..."
python3 backend/run.py

#!/usr/bin/env bash
# ==========================================================================
# Aroviax — Development Environment Setup (Unix/macOS/Linux)
#
# Sets up the local development environment:
#   1. Checks prerequisites (Node.js, npm, Python)
#   2. Installs Node.js dependencies
#   3. Creates .env from .env.example if missing
#   4. Validates Python tools
#   5. Runs linting and tests
#
# Usage: bash scripts/setup-dev.sh
# ==========================================================================

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()  { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
fail()  { echo -e "${RED}✗${NC} $1"; exit 1; }

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Aroviax — AI Health Companion — Dev Setup           ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# --------------------------------------------------------------------------
# 1. Check prerequisites
# --------------------------------------------------------------------------
echo "▶ Checking prerequisites..."

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    info "Node.js ${NODE_VERSION}"
    # Check minimum version (v20+)
    MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
    if [ "$MAJOR" -lt 20 ]; then
        warn "Node.js v20+ recommended (found ${NODE_VERSION})"
    fi
else
    fail "Node.js not found. Install from https://nodejs.org/"
fi

# npm
if command -v npm &> /dev/null; then
    info "npm $(npm --version)"
else
    fail "npm not found"
fi

# Python (optional, for tools/)
if command -v python3 &> /dev/null; then
    info "Python $(python3 --version 2>&1 | awk '{print $2}')"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    info "Python $(python --version 2>&1 | awk '{print $2}')"
    PYTHON_CMD="python"
else
    warn "Python not found — tools/validate_health_data.py will not be available"
    PYTHON_CMD=""
fi

echo ""

# --------------------------------------------------------------------------
# 2. Install Node.js dependencies
# --------------------------------------------------------------------------
echo "▶ Installing Node.js dependencies..."

if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    info "node_modules exists, running npm ci for clean install..."
else
    info "First install, running npm ci..."
fi

npm ci --loglevel=warn
info "Dependencies installed"

echo ""

# --------------------------------------------------------------------------
# 3. Create .env from template if missing
# --------------------------------------------------------------------------
echo "▶ Checking environment configuration..."

if [ -f ".env" ] || [ -f ".env.local" ]; then
    info ".env file exists"
else
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        info "Created .env.local from .env.example — edit it with your API keys"
    else
        warn "No .env.example found — create .env.local manually"
    fi
fi

echo ""

# --------------------------------------------------------------------------
# 4. Validate Python tools
# --------------------------------------------------------------------------
if [ -n "${PYTHON_CMD:-}" ]; then
    echo "▶ Validating Python tools..."
    if $PYTHON_CMD -c "import json, re, sys; print('  Python stdlib OK')" 2>/dev/null; then
        info "Python validation tools ready"
    else
        warn "Python stdlib check failed"
    fi
    echo ""
fi

# --------------------------------------------------------------------------
# 5. Run linting and tests
# --------------------------------------------------------------------------
echo "▶ Running lint check..."
npm run lint && info "Lint passed" || warn "Lint issues found"

echo ""

echo "▶ Running tests..."
npm test && info "All tests passed" || warn "Some tests failed"

echo ""

# --------------------------------------------------------------------------
# Done
# --------------------------------------------------------------------------
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Setup complete!                                     ║"
echo "║                                                       ║"
echo "║   Start dev server:  npm run dev                      ║"
echo "║   Run tests:         npm test                         ║"
echo "║   Production build:  npm run build                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

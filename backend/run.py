#!/usr/bin/env python3
"""
Aroviax — Run Backend Development Server
Usage: python backend/run.py
"""

import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import uvicorn
from backend.app.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.app_name} on http://{settings.host}:{settings.port}")
    uvicorn.run("backend.app.main:app", host=settings.host, port=settings.port, reload=True)

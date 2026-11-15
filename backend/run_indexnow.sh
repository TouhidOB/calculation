#!/usr/bin/env bash
# ==============================================================================
# TryCalc IndexNow Cron Submission Runner
# Usage: ./backend/run_indexnow.sh [--dry-run] [--limit N]
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_EXEC="python3"

# Use venv python if available, otherwise default python3
if [ -x "${SCRIPT_DIR}/venv/bin/python3" ]; then
    PYTHON_EXEC="${SCRIPT_DIR}/venv/bin/python3"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_EXEC="python3"
else
    echo "ERROR: python3 not found." >&2
    exit 1
fi

echo "Running TryCalc IndexNow Automated Submission with ${PYTHON_EXEC}..."
exec "${PYTHON_EXEC}" "${SCRIPT_DIR}/cron_indexnow.py" "$@"

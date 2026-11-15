#!/usr/bin/env bash
# ==============================================================================
# TryCalc Autonomous 24x7 SEO Agent Runner
# Powered by OpenRouter API LLM
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_EXEC="python3"

if [ -x "${SCRIPT_DIR}/venv/bin/python3" ]; then
    PYTHON_EXEC="${SCRIPT_DIR}/venv/bin/python3"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_EXEC="python3"
else
    echo "ERROR: python3 not found." >&2
    exit 1
fi

LOG_FILE="/var/log/trycalc_seo_agent.log"
if [ ! -w "/var/log" ] 2>/dev/null; then
    LOG_FILE="${SCRIPT_DIR}/trycalc_seo_agent.log"
fi

echo "=================================================================" >> "${LOG_FILE}"
date >> "${LOG_FILE}"
exec "${PYTHON_EXEC}" "${SCRIPT_DIR}/cron_seo_agent.py" "$@" >> "${LOG_FILE}" 2>&1

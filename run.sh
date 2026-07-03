#!/usr/bin/env bash
set -e

echo "Iniciando Mini Inbox..."

# Roda o ETL se o metrics.json ainda não existe
if [ ! -f "data/processed/metrics.json" ]; then
  echo "Rodando ETL..."
  (cd data && uv run python etl.py)
fi

# Sobe backend e frontend em paralelo
(cd backend && uv run uvicorn main:app --reload) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Garante que os dois processos morrem juntos ao dar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait

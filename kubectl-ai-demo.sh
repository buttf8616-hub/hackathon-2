#!/bin/bash
export OPENAI_API_KEY="${GEMINI_API_KEY:?GEMINI_API_KEY env var required}"
export OPENAI_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/openai/"

echo "=== Query 1: Show all running pods ==="
kubectl-ai --openai-api-key "$OPENAI_API_KEY" --openai-endpoint "$OPENAI_ENDPOINT" "show all running pods"

echo ""
echo "=== Query 2: Show all services ==="
kubectl-ai --openai-api-key "$OPENAI_API_KEY" --openai-endpoint "$OPENAI_ENDPOINT" "show all services"

echo ""
echo "=== Query 3: How many pods are running? ==="
kubectl-ai --openai-api-key "$OPENAI_API_KEY" --openai-endpoint "$OPENAI_ENDPOINT" "how many pods are running"

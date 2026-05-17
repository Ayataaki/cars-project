#!/bin/sh

set -e

MODEL=${OLLAMA_MODEL:-tinyllama}

echo "🚀 Starting Ollama..."

# Start Ollama server in background
ollama serve &
OLLAMA_PID=$!

echo "⏳ Waiting for Ollama API..."

until wget -qO- http://localhost:11434/api/tags >/dev/null 2>&1
do
  echo "   ...Ollama not ready yet"
  sleep 2
done

echo "✅ Ollama API ready"

# Check if model already exists
if ollama list | grep -q "$MODEL"; then
  echo "✅ Model $MODEL already installed"
else
  echo "📥 Pulling model: $MODEL"
  ollama pull "$MODEL"
  echo "✅ Model downloaded"
fi

echo "🚀 Ollama ready with model: $MODEL"

wait $OLLAMA_PID
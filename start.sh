#!/bin/bash

echo "🚗 MiolaCar Mac/Linux Start"

if [ ! -f .env ]; then
  echo "❌ .env manquant"
  exit 1
fi

find_free_port() {
  port=$1
  while lsof -i:$port > /dev/null 2>&1
  do
    port=$((port+1))
  done
  echo $port
}

BACKEND_PORT=$(find_free_port 8080)
FRONTEND_PORT=$(find_free_port 3030)
DATABASE_PORT=$(find_free_port 3306)


export BACKEND_PORT
export FRONTEND_PORT
export DATABASE_PORT

echo "Backend → $BACKEND_PORT"
echo "Frontend → $FRONTEND_PORT"
echo "Database → $DATABASE_PORT"

echo "▶ Nettoyage Docker..."
docker compose down --remove-orphans

echo "▶ Lancement application..."
docker compose up --build

# La commande pour lancer !
# chmod +x start.sh
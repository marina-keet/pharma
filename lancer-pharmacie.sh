#!/bin/bash
# Script de lancement automatique pour gestion de pharmacie

gnome-terminal -- bash -c "cd ~/gestion\ de\ pharmacie/backend && npm start"
gnome-terminal -- bash -c "cd ~/gestion\ de\ pharmacie/frontend && live-server --port=8080"

echo "Backend lancé sur le port 3001. Frontend lancé sur le port 8080."

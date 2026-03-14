#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Backend Deps
pip install -r requirements.txt

# Build Frontend
cd ../coreinventory_frontend
npm install
npm run build
cd ../coreinventory_backend

# Collect Static Files
python manage.py collectstatic --no-input

# Run Migrations
python manage.py migrate

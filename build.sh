#!/usr/bin/env bash
# exit on error
set -o errexit

# Build Frontend
cd frontend
npm install
npm run build
cd ..

# Install Backend Deps
cd backend
pip install -r requirements.txt

# Collect Static Files
python manage.py collectstatic --no-input

# Run Migrations
python manage.py migrate
cd ..

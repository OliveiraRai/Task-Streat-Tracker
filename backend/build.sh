#!/usr/bin/env bash

pip install -r requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
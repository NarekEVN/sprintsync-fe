#!/bin/sh
set -e
if [ -n "$BACKEND_URL" ]; then
    sed -i "s|%%API_URL%%|$BACKEND_URL|" /usr/share/nginx/html/config.js
fi
exec nginx -g 'daemon off;'

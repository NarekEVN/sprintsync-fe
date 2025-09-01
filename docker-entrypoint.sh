#!/bin/bash
set -e

if [ -n "$BACKEND_URL" ]; then
    sed -i "s|set \$backend_url .*;|set \$backend_url $BACKEND_URL;|" /etc/nginx/conf.d/default.conf
fi

if [ "$1" = 'nginx' ]; then
    exec nginx -g 'daemon off;'
else
    exec "$@"
fi

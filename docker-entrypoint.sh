#!/bin/bash
set -e

# Replace the backend URL in the nginx config
if [ -n "$BACKEND_URL" ]; then
    sed -i "s|set \$backend_url .*;|set \$backend_url $BACKEND_URL;|" /etc/nginx/conf.d/default.conf
fi

# Execute the CMD
if [ "$1" = 'nginx' ]; then
    exec nginx -g 'daemon off;'
else
    exec "$@"
fi

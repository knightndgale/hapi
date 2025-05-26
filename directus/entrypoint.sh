#!/bin/sh

cd /directus
node cli.js bootstrap

cd /
pm2-runtime start ecosystem.config.js &

# Function to check if the Directus service is up
check_service() {
  # Attempt to connect to the Directus ping endpoint
  # Replace 'http://localhost:8055/server/ping' with your actual service URL if different
  if curl -s http://localhost:8055/server/ping | grep "pong" > /dev/null; then
    echo "Server is ready..."
    return 0
  else
    return 1
  fi
}

# Wait for services to be up
max_retries=30
retry_count=0
until check_service || [ $retry_count -eq $max_retries ]; do
  echo "Waiting for services to be ready..."
  sleep 1
  retry_count=$((retry_count + 1))
done

if [ $retry_count -eq $max_retries ]; then
  echo "Services did not become ready in time. Exiting."
  exit 1
fi

# Start Nginx
nginx -g "daemon off;"
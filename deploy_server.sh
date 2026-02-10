#!/usr/bin/env bash
set -euo pipefail

# Bootstrap script to run on the Ubuntu 22.04 server (149.56.132.131)
# Usage: sudo bash deploy_server.sh

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root: sudo $0"
  exit 1
fi

apt update
apt install -y ca-certificates curl gnupg lsb-release git
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmour -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# create deploy directory
DEEPLOY_DIR=/opt/amcoder
mkdir -p $DEEPLOY_DIR
chown $SUDO_USER:$SUDO_USER $DEEPLOY_DIR || true

sudo -u $SUDO_USER bash -lc "cd /opt && git clone https://github.com/your/repo.git amcoder || (cd amcoder && git pull)"

cd $DEEPLOY_DIR
sudo -u $SUDO_USER bash -lc "cp .env.example .env || true"

# remind to edit .env if defaults are insecure
echo "\nPlease edit $DEEPLOY_DIR/.env to set secure passwords (MSSQL_PASSWORD etc.) if needed."

# start services
docker compose up -d --build

echo "Deployment complete. Use 'docker compose logs -f' to follow logs."

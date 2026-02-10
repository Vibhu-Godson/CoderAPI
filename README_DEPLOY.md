# Deployment steps for server (149.56.132.131)

Prereqs on the Ubuntu 22.04 server:

- A non-root sudo user with SSH access.
- Docker Engine and Docker Compose plugin installed.

Quick install commands (run on the server):

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmour -o /etc/apt/keyrings/docker.gpg
echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

On your local machine or server, from the repository root (this repo contains `docker-compose.yml` and `Dockerfile`):

```bash
# build and run everything
docker compose up -d --build

# view logs
docker compose logs -f
```

Ports exposed by the compose file:

- API: 5000
- MSSQL: 1433
- RabbitMQ: 5672 (AMQP), 15672 (management)
- Judge0 (API): 3000

Notes & next steps:

- Change the MSSQL `SA_PASSWORD` and `ConnectionStrings__DefaultConnection` in `docker-compose.yml` to secure values before production.
- If you want the API routed to port 80/443, add a reverse-proxy service (nginx or Traefik) and configure TLS.
- Verify the `judge0` image name/version if you need a specific Judge0 build; adjust `docker-compose.yml` accordingly.

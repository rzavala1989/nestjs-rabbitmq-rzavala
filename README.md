Prerequisites:
- Docker (v20.10 or later)
- Docker Compose (v1.29 or later)
- Node.js (v22.x LTS recommended for local development if not using Docker)

Installation:
1. Clone the repository:
    git clone https://github.com/rzavala1989/nestjs-rabbitmq-rzavala.git
2. Navigate to the project directory
3. Create a .env file and set the necessary environment variables `cp .env.example .env`
4. Run `docker-compose build` to build the Docker images
5. Run `docker-compose up -d` to start the containers

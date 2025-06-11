# NestJS RabbitMQ Project

## Prerequisites
- Docker (v20.10 or later)
- Docker Compose (v1.29 or later)
- Node.js (v22.x LTS recommended for local development if not using Docker)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rzavala1989/nestjs-rabbitmq-rzavala.git
   ```
2. Navigate to the project directory
3. Create a `.env` file and set the necessary environment variables:
   ```bash
   cp .env.example .env
   ```
4. Build the Docker images:
   ```bash
   docker-compose build
   ```
5. Start the containers:
   ```bash
   docker-compose up -d
   ```

## Using the API

The primary way to interact with the application is through its GraphQL API. Once the containers are running, you can access the GraphQL Playground in your browser.

**API Playground URL:** http://localhost:3000/graphql

## Example Workflow & Testing

Here is a simple workflow to test the full, end-to-end functionality of the application.

### 1. Create a New Edge

This mutation will create a new record in the Postgres database and simultaneously publish an event to the RabbitMQ queue.

```graphql
mutation {
  createEdge(createEdgeInput: {
    node1_alias: "alpha-node",
    node2_alias: "beta-node"
  }) {
    id
    node1_alias
    node2_alias
    capacity
  }
}
```

**Important:** Copy the `id` from the response, as you will need it in the next step to verify the update.

### 2. Verify the Asynchronous Update

After the mutation is successful, the RabbitMQ handler will consume the event and update the aliases in the database. You can verify this by querying for the edge you just created.

Replace `<YOUR_ID_HERE>` with the `id` you copied from the previous step.

```graphql
query {
  getEdge(id: "<YOUR_ID_HERE>") {
    id
    node1_alias
    node2_alias
    updated_at
  }
}
```

The response will show that `node1_alias` and `node2_alias` now have an `-updated` suffix, confirming the entire workflow was successful.

### 3. Fetch All Edges

To see all the data currently in the database, use the `getEdges` query.

```graphql
query {
  getEdges {
    id
    node1_alias
    node2_alias
    capacity
    created_at
    updated_at
  }
}
```

## Environment Variables

The application is configured using a `.env` file. The following variables are required:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | The username for the Postgres database |
| `POSTGRES_PASSWORD` | The password for the Postgres database |
| `POSTGRES_DB` | The name of the database to use |
| `RABBITMQ_DEFAULT_USER` | The username for the RabbitMQ message broker |
| `RABBITMQ_DEFAULT_PASS` | The password for the RabbitMQ message broker |

## Stopping the Application

To stop all running containers, navigate to the project root and run:

```bash
docker-compose down
```

If you want to stop the containers and delete all data stored in the database volume, use the `-v` flag:

```bash
docker-compose down -v
```

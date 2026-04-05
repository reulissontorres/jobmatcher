# jobmatcher
JobMatcher - Tecnologia, Impacto e Expansão Regional

## JobMatcher.Identity (Identity Service)

This project contains the Identity microservice for JobMatcher (authentication, registration, companies, JWT issuance).

---

## Prerequisites

- .NET 10 SDK installed
- Docker & Docker Compose (Compose V2 recommended)
- Optional: `psql` client and `dotnet-ef` (for manual migrations)

---

## Ports / defaults

- Identity API: http://localhost:5297
- PostgreSQL (container -> host): 5432 inside container, mapped to host port **5433** by default in this repository
- Connection string: `JobMatcher.IdentityCore/appsettings.json` (DefaultConnection)

> Note: the compose file in the repository has been updated to map host port `5433:5432` to avoid conflicts with a local Postgres instance. If you prefer to use `5432` on the host, stop your host Postgres service and update the compose mapping and `appsettings.json` accordingly.

---

## Quick start (recommended)

1. From repository root, start the database with Docker Compose:

```bash
cd /home/reulisson/Source/csharp/repos/jobmatcher
docker compose up -d
```

2. Wait for Postgres to initialize. Watch logs:

```bash
docker compose logs -f postgres-core
# or
docker logs -f jobmatcher-db
```

3. Start the API (project folder `JobMatcher.IdentityCore`):

```bash
cd JobMatcher.IdentityCore
# (optional) install dotnet-ef if you need to run migrations manually
dotnet tool install --global dotnet-ef --version 10.0.5

# apply migrations (if you scaffolded/changed them)
dotnet-ef database update

dotnet run
```

The app will run on `http://localhost:5297` by default.

> Program.cs also attempts to apply migrations at startup when compiled migrations are present.

---

## Endpoints (Auth)

All endpoints are under `/api/auth`.

- POST `/api/auth/register` — register a new user
	- Body (JSON): `{ "fullName": "Alice", "email": "alice@example.com", "password": "P@ssw0rd!", "companyName": "Acme" }`

Example:

```bash
curl -i -X POST http://localhost:5297/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"fullName":"Alice","email":"alice@example.com","password":"P@ssw0rd!","companyName":"Acme"}'
```

- POST `/api/auth/login` — login and receive JWT
	- Body (JSON): `{ "email": "alice@example.com", "password": "P@ssw0rd!" }`

Example:

```bash
curl -i -X POST http://localhost:5297/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"P@ssw0rd!"}'
```

Successful responses return a JSON object containing `token`, `expiration` and `user` info.

To call protected endpoints from other services/frontends, include the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5297/api/some-protected-endpoint
```

---

## Troubleshooting

- "password authentication failed for user": this usually happens when a Postgres data volume was initialized previously with a different password. If you are ok losing DB data, remove the container and its volume and recreate it:

```bash
docker rm -f jobmatcher-db
docker volume rm jobmatcher_pgdata
docker compose up -d
```

- Port conflicts: API defaults to port `5297`. If `dotnet run` fails with `AddressInUse`, find and stop existing process:

```bash
ss -ltnp | grep ':5297'
kill <pid>
```

- DB connection issues: check `docker logs -f jobmatcher-db` and `JobMatcher.IdentityCore/appsettings.json` connection string.

---

## Notes & next steps

- Replace `Jwt:Secret` from `appsettings.json` with a secure secret (use environment variables or a secret manager for production).
- If you want a full Swagger UI, add `Swashbuckle.AspNetCore` and configure security definitions (this project includes a minimal OpenAPI setup for development).
- To reset the DB schema during development, remove the `jobmatcher_pgdata` volume and re-run compose (see troubleshooting above).

---

If you want, I can also add a `Makefile` or `scripts/` folder with the common commands (`start`, `stop`, `migrate`, `reset-db`) for convenience.


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

## Endpoints (Candidates)

The Candidates API provides CRUD and listing features used by the React frontend. All endpoints are under `/api/candidates` and require authentication.

- `POST /api/candidates` — create candidate
	- Body: `CreateCandidateRequest` JSON (see DTOs in code). Example:

```bash
curl -X POST http://localhost:5297/api/candidates \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"fullName":"Jane Doe","email":"jane@example.com","phone":"+551199999999","resumeText":"Experienced backend developer...","skills":[{"name":"C#","level":90},{"name":"EF Core","level":80}],"workExperiences":[{"companyName":"Acme","role":"Backend Engineer","startDate":"2019-01-01"}],"educations":[{"institution":"State University","degree":"BSc Computer Science","startDate":"2014-02-01","endDate":"2018-12-01"}] }'
```

- `GET /api/candidates` — list candidates
	- Query params:
		- `search` (string) — name search
		- `skill` (string) — filter by skill name
		- `jobId` (Guid) — include `MatchScore` from `Application` and order by it
		- `page` (int), `pageSize` (int) — pagination
	- Response: list of `CandidateResponse` (includes `Id`, `FullName`, `TopSkills`, `ExperienceSummary`, optional `MatchScore`).

Example:

```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:5297/api/candidates?search=Jane&skill=C%23&page=1&pageSize=20"
```

- `GET /api/candidates/{id}` — get candidate details
	- Response: `CandidateDetailsResponse` (full profile, skills with levels, work experiences, educations, applications summary).

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5297/api/candidates/<candidate-id>
```

- `PUT /api/candidates/{id}` — update candidate
	- Body: `UpdateCandidateRequest` (same shape as create). Returns updated `CandidateResponse`.

```bash
curl -X PUT http://localhost:5297/api/candidates/<candidate-id> \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"fullName":"Jane Doe Updated","skills":[{"name":"C#","level":95}] }'
```

- `DELETE /api/candidates/{id}` — delete candidate (cascade removes related skills links, experiences, educations)

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:5297/api/candidates/<candidate-id>
```

Notes:
- `Email` and `Phone` are optional to comply with LGPD; they appear only in detail responses.
- Skill `level` must be between `1` and `100`.
- When `jobId` is provided to the list endpoint, `MatchScore` from the corresponding `Application` is returned and the list is ordered by score (highest first).
- Listing uses pagination (`page` and `pageSize`) — defaults are `page=1`, `pageSize=20`.


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

---

## Using Insomnia to exercise the API

This project exposes a simple REST API you can interact with using any HTTP client. The steps below show how to use Insomnia (desktop) to run the common flows: register/login, seed a company (dev), create a job and list jobs.

1) Install Insomnia: https://insomnia.rest/

2) Create a local environment

- Open **Manage Environments** (top-left) and add a new environment (for example `Local`). Use this JSON for the environment variables:

```json
{
	"base_url": "http://localhost:5000",
	"token": ""
}
```

Note: the API may run on a different port (see the `dotnet run` output). If your server prints `Now listening on: http://localhost:5297` update `base_url` accordingly.

3) Create the Register request

- New Request → POST → URL: `{{ base_url }}/api/auth/register`
- Header: `Content-Type: application/json`
- Body (JSON):

```json
{
	"fullName": "Test User",
	"email": "test.user@example.com",
	"password": "P@ssw0rd123"
}
```

- Send the request. The response is an `AuthResponse` containing `token`.

4) Create the Login request and capture token

- New Request → POST → URL: `{{ base_url }}/api/auth/login`
- Body (JSON):

```json
{
	"email": "test.user@example.com",
	"password": "P@ssw0rd123"
}
```

- Send the request. Copy the returned `token` value (string).

5) Save the token in the environment

- Open **Manage Environments** and paste the token into the `token` variable for your `Local` environment. The environment JSON should now look like:

```json
{
	"base_url": "http://localhost:5000",
	"token": "eyJhbGciOi..."
}
```

6) Use the token for protected requests

- For every protected request add the header:

```
Authorization: Bearer {{ token }}
```

Insomnia will substitute the token value from the environment when sending the request.

7) Seed a test company (dev-only endpoint)

- Endpoint: `POST {{ base_url }}/api/dev/seed-company?name=MyTestCo`
- Header: `Authorization: Bearer {{ token }}`
- This endpoint creates a `Company` and assigns the authenticated user to it. Useful when your user has no `CompanyId` yet.

8) Create a Job

- Endpoint: `POST {{ base_url }}/api/jobs`
- Header: `Authorization: Bearer {{ token }}` and `Content-Type: application/json`
- Body example:

```json
{
	"title": "Software Engineer",
	"description": "Build backend services",
	"requirements": "C#, .NET 10, EF Core",
	"location": "Remote",
	"salaryRange": "80k-120k",
	"employmentType": "Full-time"
}
```

9) List Jobs

- Endpoint: `GET {{ base_url }}/api/jobs`
- Header: `Authorization: Bearer {{ token }}`
- Optional query params: `status` (text name e.g. `Open`), `search`, `location`.

10) Job details / update / delete

- `GET {{ base_url }}/api/jobs/{id}` — job details (includes `applications`)
- `PUT {{ base_url }}/api/jobs/{id}` — update; body same as create plus `status` (enum: `0` = Draft, `1` = Open, `2` = Closed)
- `DELETE {{ base_url }}/api/jobs/{id}` — soft-close (sets `Status` to `Closed`)

Notes:
- The dev seed endpoint requires authentication and is intended for local development only.
- If you prefer automating token extraction, Insomnia supports response hooks and environment templating; for quick tests copying the token into the environment is simplest.

---

If you'd like, I can export an Insomnia workspace JSON that includes the above requests and environment so you can import it directly. Would you like me to add that export to the repo?


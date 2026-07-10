# Soyuz Corp Flask Backend

Flask API and admin panel for project cards and project detail pages.

## Local setup

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
Copy-Item .env.example .env
```

Create a PostgreSQL database named `soyuz_corp`, then edit `.env` if your local
Postgres user, password, host, or database name is different.

## Database setup

```powershell
flask --app app db init
flask --app app db migrate -m "create project tables"
flask --app app db upgrade
flask --app app create-admin --email admin@example.com --password your-password
```

## Run

```powershell
flask --app app run --debug --port 5000
```

Public API:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/<slug>`

Admin panel:

- `http://localhost:5000/admin`

Uploaded files are served from:

- `http://localhost:5000/uploads/<filename>`

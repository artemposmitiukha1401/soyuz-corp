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

In `psql`, create the database with:

```sql
CREATE DATABASE soyuz_corp;
```

## Database setup

```powershell
flask --app app db init
flask --app app db migrate -m "create project tables"
flask --app app db upgrade
flask --app app create-admin --email admin@example.com --password your-password
```

After backend dependency or migration updates, run:

```powershell
pip install -e .
flask --app app db upgrade
```

Project validation rejects blank required fields, invalid slugs, years outside
1900-2100, an end year before the start year, invalid image paths, and duplicate
gallery image positions. Uploaded image files are checked by their actual image
content, not only their filename.

If `db migrate` fails with `password authentication failed for user "postgres"`,
update the password inside `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_real_postgres_password@localhost:5432/soyuz_corp
```

Do not run `db init` again if the `migrations` folder already exists. After
fixing the password, continue with `db migrate` and `db upgrade`.

Flask-Migrate creates the tables from `app/models.py`. The project data table
has these fields:

- `title`
- `slug`
- `customer`
- `contract_subject`
- `industry`
- `territory`
- `start_year`
- `end_year`
- `short_description`
- `full_description`
- `cover_image_url`
- `is_published`

Gallery images are stored in `project_images` and connected to `projects` by
`project_id`.

## Run

```powershell
flask --app app run --debug --port 5000
```

Public API:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/<slug>`

Project card fields returned by `GET /api/projects`:

- `title`
- `slug`
- `customer`
- `contractSubject`
- `industry`
- `territory`
- `startYear`
- `endYear`
- `shortDescription`
- `coverImageUrl`

Project detail fields returned by `GET /api/projects/<slug>`:

- all card fields
- `fullDescription`
- `images`
- `createdAt`
- `updatedAt`

Admin panel:

- `http://localhost:5000/admin`

Uploaded files are served from:

- `http://localhost:5000/uploads/<filename>`

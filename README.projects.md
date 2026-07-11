# Projects Database And Page Setup

## 1. Create PostgreSQL database

Open `psql` or pgAdmin and run:

```sql
CREATE DATABASE soyuz_corp;
```

## 2. Configure Flask

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/soyuz_corp
SECRET_KEY=change-this-secret-key
FRONTEND_ORIGIN=http://localhost:3000
UPLOAD_FOLDER=uploads
```

## 3. Create tables

Run inside `backend` after installing backend dependencies:

```powershell
flask --app app db init
flask --app app db migrate -m "create project tables"
flask --app app db upgrade
```

These commands create:

- `projects`
- `project_images`
- `admin_users`

## 4. Add project data

Create an admin user:

```powershell
flask --app app create-admin --email admin@example.com --password your-password
```

Run Flask:

```powershell
flask --app app run --debug --port 5000
```

Open `http://localhost:5000/admin`, log in, then create projects and gallery
images there.

## 5. Configure Next.js

Create `.env` in the project root:

```env
PROJECTS_API_BASE_URL=http://localhost:5000
```

The projects page now loads data from Flask:

- `/projects` loads all published projects from `GET /api/projects`
- `/projects/[slug]` loads one project from `GET /api/projects/<slug>`

"""seed legacy projects

Revision ID: d6e5f8b0c213
Revises: c5d4e7a9b102
Create Date: 2026-07-13 00:00:00.000000
"""

import json
from pathlib import Path

import sqlalchemy as sa
from alembic import op


revision = "d6e5f8b0c213"
down_revision = "c5d4e7a9b102"
branch_labels = None
depends_on = None

PROJECT_DATA_PATH = Path(__file__).resolve().parents[2] / "app" / "data" / "legacy_projects.json"

UPSERT_PROJECT_SQL = sa.text(
    """
    INSERT INTO projects (
        title,
        slug,
        customer,
        contract_subject,
        industry,
        territory,
        start_year,
        end_year,
        short_description,
        full_description,
        cover_image_url,
        is_published,
        created_at,
        updated_at
    ) VALUES (
        :title,
        :slug,
        :customer,
        :contract_subject,
        :industry,
        :territory,
        :start_year,
        :end_year,
        :short_description,
        :full_description,
        NULL,
        :is_published,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        customer = EXCLUDED.customer,
        contract_subject = EXCLUDED.contract_subject,
        industry = EXCLUDED.industry,
        territory = EXCLUDED.territory,
        start_year = EXCLUDED.start_year,
        end_year = EXCLUDED.end_year,
        short_description = EXCLUDED.short_description,
        full_description = EXCLUDED.full_description,
        is_published = EXCLUDED.is_published,
        updated_at = NOW()
    """
)


def _read_project_records() -> list[dict[str, object]]:
    raw_records: object = json.loads(PROJECT_DATA_PATH.read_text(encoding="utf-8"))

    if not isinstance(raw_records, list) or len(raw_records) != 38:
        raise RuntimeError("Legacy project seed data must contain exactly 38 records.")

    return [
        {
            "title": record["title"],
            "slug": record["slug"],
            "customer": record["customer"],
            "contract_subject": record["contractSubject"],
            "industry": record["industry"],
            "territory": record["territory"],
            "start_year": record["startYear"],
            "end_year": record["endYear"],
            "short_description": record["shortDescription"],
            "full_description": record["fullDescription"],
            "is_published": record["isPublished"],
        }
        for record in raw_records
        if isinstance(record, dict)
    ]


def upgrade() -> None:
    project_records: list[dict[str, object]] = _read_project_records()

    if len(project_records) != 38:
        raise RuntimeError("Legacy project seed data contains invalid records.")

    op.get_bind().execute(UPSERT_PROJECT_SQL, project_records)


def downgrade() -> None:
    op.execute("DELETE FROM projects WHERE slug LIKE 'legacy-project-%'")

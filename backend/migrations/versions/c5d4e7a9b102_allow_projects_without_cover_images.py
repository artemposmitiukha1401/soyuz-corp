"""allow projects without cover images

Revision ID: c5d4e7a9b102
Revises: a4c2b8e6f901
Create Date: 2026-07-13 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op


revision = "c5d4e7a9b102"
down_revision = "a4c2b8e6f901"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "projects",
        "cover_image_url",
        existing_type=sa.String(length=500),
        nullable=True,
    )


def downgrade() -> None:
    missing_cover_count: int = op.get_bind().scalar(
        sa.text("SELECT COUNT(*) FROM projects WHERE cover_image_url IS NULL")
    ) or 0

    if missing_cover_count > 0:
        raise RuntimeError("Cannot require project cover images while projects without covers exist.")

    op.alter_column(
        "projects",
        "cover_image_url",
        existing_type=sa.String(length=500),
        nullable=False,
    )

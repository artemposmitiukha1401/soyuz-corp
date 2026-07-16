"""add big project flag

Revision ID: e7f9a1b2c324
Revises: d6e5f8b0c213
Create Date: 2026-07-15 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op


revision = "e7f9a1b2c324"
down_revision = "d6e5f8b0c213"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("is_big_project", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("projects", "is_big_project")

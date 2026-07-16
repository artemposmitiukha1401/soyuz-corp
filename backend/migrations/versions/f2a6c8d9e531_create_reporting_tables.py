"""create reporting tables

Revision ID: f2a6c8d9e531
Revises: e7f9a1b2c324
Create Date: 2026-07-16 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op


revision = "f2a6c8d9e531"
down_revision = "e7f9a1b2c324"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "reportings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("year BETWEEN 1900 AND 2100", name="reportings_year_range"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("year"),
    )
    op.create_index("ix_reportings_year", "reportings", ["year"], unique=False)
    op.create_table(
        "reporting_documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("reporting_id", sa.Integer(), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("btrim(label) <> ''", name="reporting_documents_label_not_blank"),
        sa.CheckConstraint("file_url ~ '^https?://'", name="reporting_documents_file_url_format"),
        sa.CheckConstraint("btrim(storage_key) <> ''", name="reporting_documents_storage_key_not_blank"),
        sa.ForeignKeyConstraint(["reporting_id"], ["reportings.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("storage_key"),
    )
    op.create_index(
        "ix_reporting_documents_reporting_id",
        "reporting_documents",
        ["reporting_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_reporting_documents_reporting_id", table_name="reporting_documents")
    op.drop_table("reporting_documents")
    op.drop_index("ix_reportings_year", table_name="reportings")
    op.drop_table("reportings")

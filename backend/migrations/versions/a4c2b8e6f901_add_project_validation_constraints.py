"""add project validation constraints

Revision ID: a4c2b8e6f901
Revises: 19d2be3f0360
Create Date: 2026-07-11 00:00:00.000000
"""

from alembic import op


revision = "a4c2b8e6f901"
down_revision = "19d2be3f0360"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_check_constraint("projects_title_not_blank", "projects", "btrim(title) <> ''")
    op.create_check_constraint("projects_customer_not_blank", "projects", "btrim(customer) <> ''")
    op.create_check_constraint(
        "projects_contract_subject_not_blank",
        "projects",
        "btrim(contract_subject) <> ''",
    )
    op.create_check_constraint("projects_industry_not_blank", "projects", "btrim(industry) <> ''")
    op.create_check_constraint("projects_territory_not_blank", "projects", "btrim(territory) <> ''")
    op.create_check_constraint(
        "projects_short_description_not_blank",
        "projects",
        "btrim(short_description) <> ''",
    )
    op.create_check_constraint(
        "projects_full_description_not_blank",
        "projects",
        "btrim(full_description) <> ''",
    )
    op.create_check_constraint("projects_start_year_range", "projects", "start_year BETWEEN 1900 AND 2100")
    op.create_check_constraint("projects_end_year_range", "projects", "end_year BETWEEN 1900 AND 2100")
    op.create_check_constraint("projects_year_range_ordered", "projects", "start_year <= end_year")
    op.create_check_constraint(
        "projects_slug_format",
        "projects",
        "slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'",
    )
    op.create_check_constraint(
        "projects_cover_image_url_format",
        "projects",
        "cover_image_url ~ '^(https?://|/uploads/)'",
    )
    op.create_check_constraint(
        "project_images_alt_text_not_blank",
        "project_images",
        "btrim(alt_text) <> ''",
    )
    op.create_check_constraint(
        "project_images_sort_order_not_negative",
        "project_images",
        "sort_order >= 0",
    )
    op.create_check_constraint(
        "project_images_image_url_format",
        "project_images",
        "image_url ~ '^(https?://|/uploads/)'",
    )
    op.create_unique_constraint(
        "project_images_project_sort_order_unique",
        "project_images",
        ["project_id", "sort_order"],
    )


def downgrade() -> None:
    op.drop_constraint("project_images_project_sort_order_unique", "project_images", type_="unique")
    op.drop_constraint("project_images_image_url_format", "project_images", type_="check")
    op.drop_constraint("project_images_sort_order_not_negative", "project_images", type_="check")
    op.drop_constraint("project_images_alt_text_not_blank", "project_images", type_="check")
    op.drop_constraint("projects_cover_image_url_format", "projects", type_="check")
    op.drop_constraint("projects_slug_format", "projects", type_="check")
    op.drop_constraint("projects_year_range_ordered", "projects", type_="check")
    op.drop_constraint("projects_end_year_range", "projects", type_="check")
    op.drop_constraint("projects_start_year_range", "projects", type_="check")
    op.drop_constraint("projects_full_description_not_blank", "projects", type_="check")
    op.drop_constraint("projects_short_description_not_blank", "projects", type_="check")
    op.drop_constraint("projects_territory_not_blank", "projects", type_="check")
    op.drop_constraint("projects_industry_not_blank", "projects", type_="check")
    op.drop_constraint("projects_contract_subject_not_blank", "projects", type_="check")
    op.drop_constraint("projects_customer_not_blank", "projects", type_="check")
    op.drop_constraint("projects_title_not_blank", "projects", type_="check")

from pathlib import Path

import click
from flask import Flask
from sqlalchemy import select

from app.config import R2Config
from app.extensions import db
from app.models import AdminUser, utc_now
from app.project_image_import import ProjectImageImportSummary, import_project_images


def register_commands(app: Flask) -> None:
    @app.cli.command("create-admin")
    @click.option("--email", required=True)
    @click.option("--password", required=True)
    def create_admin(email: str, password: str) -> None:
        query = select(AdminUser).where(AdminUser.email == email)
        existing_user: AdminUser | None = db.session.scalars(query).first()

        if existing_user is not None:
            raise click.ClickException(f"Admin user already exists: {email}")

        user = AdminUser(
            email=email,
            is_active_admin=True,
            created_at=utc_now(),
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        click.echo(f"Created admin user: {email}")

    @app.cli.command("import-project-images")
    @click.option(
        "--source-root",
        required=True,
        type=click.Path(exists=True, file_okay=False, path_type=Path),
    )
    def import_images(source_root: Path) -> None:
        r2_config: object | None = app.config.get("R2_CONFIG")

        if not isinstance(r2_config, R2Config):
            raise click.ClickException("R2 configuration is unavailable.")

        try:
            summary: ProjectImageImportSummary = import_project_images(source_root, r2_config)
        except ValueError as error:
            raise click.ClickException(str(error)) from error

        click.echo(
            "Imported project images: "
            f"new={summary.imported_images}, "
            f"existing={summary.skipped_images}, "
            f"covers={summary.updated_covers}"
        )

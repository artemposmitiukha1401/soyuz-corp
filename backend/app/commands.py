import click
from flask import Flask
from sqlalchemy import select

from app.extensions import db
from app.models import AdminUser, utc_now


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

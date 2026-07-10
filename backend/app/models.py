from datetime import UTC, datetime
from flask_login import UserMixin
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db


def utc_now() -> datetime:
    return datetime.now(UTC)


class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    customer: Mapped[str] = mapped_column(String(255), nullable=False)
    contract_subject: Mapped[str] = mapped_column(Text, nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=False)
    territory: Mapped[str] = mapped_column(String(255), nullable=False)
    start_year: Mapped[int] = mapped_column(Integer, nullable=False)
    end_year: Mapped[int] = mapped_column(Integer, nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    images: Mapped[list["ProjectImage"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="ProjectImage.sort_order",
    )

    def __str__(self) -> str:
        return self.title


class ProjectImage(db.Model):
    __tablename__ = "project_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[str] = mapped_column(String(255), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    project: Mapped[Project] = relationship(back_populates="images")

    def __str__(self) -> str:
        return self.alt_text


class AdminUser(UserMixin, db.Model):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active_admin: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @property
    def is_active(self) -> bool:
        return self.is_active_admin

    def __str__(self) -> str:
        return self.email

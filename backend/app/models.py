from datetime import UTC, datetime
from flask_login import UserMixin
from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db


def utc_now() -> datetime:
    return datetime.now(UTC)


class Project(db.Model):
    __tablename__ = "projects"
    __table_args__ = (
        CheckConstraint("btrim(title) <> ''", name="projects_title_not_blank"),
        CheckConstraint("btrim(customer) <> ''", name="projects_customer_not_blank"),
        CheckConstraint("btrim(contract_subject) <> ''", name="projects_contract_subject_not_blank"),
        CheckConstraint("btrim(industry) <> ''", name="projects_industry_not_blank"),
        CheckConstraint("btrim(territory) <> ''", name="projects_territory_not_blank"),
        CheckConstraint("btrim(short_description) <> ''", name="projects_short_description_not_blank"),
        CheckConstraint("btrim(full_description) <> ''", name="projects_full_description_not_blank"),
        CheckConstraint("start_year BETWEEN 1900 AND 2100", name="projects_start_year_range"),
        CheckConstraint("end_year BETWEEN 1900 AND 2100", name="projects_end_year_range"),
        CheckConstraint("start_year <= end_year", name="projects_year_range_ordered"),
        CheckConstraint(
            "slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'",
            name="projects_slug_format",
        ),
        CheckConstraint(
            "cover_image_url ~ '^(https?://|/uploads/)'",
            name="projects_cover_image_url_format",
        ),
    )

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
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_big_project: Mapped[bool] = mapped_column(Boolean, nullable=False)
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
    __table_args__ = (
        CheckConstraint("btrim(alt_text) <> ''", name="project_images_alt_text_not_blank"),
        CheckConstraint("sort_order >= 0", name="project_images_sort_order_not_negative"),
        CheckConstraint(
            "image_url ~ '^(https?://|/uploads/)'",
            name="project_images_image_url_format",
        ),
        UniqueConstraint("project_id", "sort_order", name="project_images_project_sort_order_unique"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[str] = mapped_column(String(255), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    project: Mapped[Project] = relationship(back_populates="images")

    def __str__(self) -> str:
        return self.alt_text


class Reporting(db.Model):
    __tablename__ = "reportings"
    __table_args__ = (
        CheckConstraint("year BETWEEN 1900 AND 2100", name="reportings_year_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    documents: Mapped[list["ReportingDocument"]] = relationship(
        back_populates="reporting",
        cascade="all, delete-orphan",
        order_by="ReportingDocument.created_at",
    )

    def __str__(self) -> str:
        return str(self.year)


class ReportingDocument(db.Model):
    __tablename__ = "reporting_documents"
    __table_args__ = (
        CheckConstraint("btrim(label) <> ''", name="reporting_documents_label_not_blank"),
        CheckConstraint("file_url ~ '^https?://'", name="reporting_documents_file_url_format"),
        CheckConstraint("btrim(storage_key) <> ''", name="reporting_documents_storage_key_not_blank"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    reporting_id: Mapped[int] = mapped_column(ForeignKey("reportings.id"), nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    reporting: Mapped[Reporting] = relationship(back_populates="documents")

    def __str__(self) -> str:
        return self.label


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

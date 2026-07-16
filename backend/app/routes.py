from typing import Literal, cast

from flask import Blueprint, Response, current_app, jsonify, request
from sqlalchemy import func, select
from sqlalchemy.sql.elements import ColumnElement

from app.extensions import db
from app.models import Project, Reporting, utc_now
from app.r2 import GalleryImage, list_gallery_images
from app.serialization import serialize_project_card, serialize_project_detail, serialize_reporting

api_bp: Blueprint = Blueprint("api", __name__, url_prefix="/api")
PROJECTS_PER_PAGE: int = 6
ProjectFilter = Literal["all", "big", "finished"]
PROJECT_FILTERS: frozenset[str] = frozenset({"all", "big", "finished"})


def _read_page_number() -> int | None:
    raw_page: str | None = request.args.get("page")

    if raw_page is None:
        return 1

    if not raw_page.isdecimal():
        return None

    page: int = int(raw_page)
    return page if page > 0 else None


def _read_project_filter() -> ProjectFilter | None:
    raw_filter: str | None = request.args.get("filter")

    if raw_filter is None:
        return "all"

    if raw_filter not in PROJECT_FILTERS:
        return None

    return cast(ProjectFilter, raw_filter)


def _create_project_filters(project_filter: ProjectFilter) -> tuple[ColumnElement[bool], ...]:
    published_projects: ColumnElement[bool] = Project.is_published.is_(True)

    if project_filter == "big":
        return published_projects, Project.is_big_project.is_(True)

    if project_filter == "finished":
        current_year: int = utc_now().year
        return published_projects, Project.end_year < current_year

    return (published_projects,)


@api_bp.get("/health")
def health() -> Response:
    return jsonify({"status": "ok"})


@api_bp.get("/gallery")
def list_gallery() -> Response:
    gallery_images: list[GalleryImage] = list_gallery_images(current_app.config["R2_CONFIG"])

    return jsonify(
        {
            "items": [
                {
                    "key": image.key,
                    "url": image.url,
                    "altText": image.alt_text,
                }
                for image in gallery_images
            ]
        }
    )


@api_bp.get("/projects")
def list_projects() -> Response:
    page: int | None = _read_page_number()
    project_filter: ProjectFilter | None = _read_project_filter()

    if page is None:
        return jsonify({"error": "Page must be a positive integer."}), 400

    if project_filter is None:
        return jsonify({"error": "Filter must be one of: all, big, finished."}), 400

    project_filters: tuple[ColumnElement[bool], ...] = _create_project_filters(project_filter)
    total: int = db.session.scalar(select(func.count()).select_from(Project).where(*project_filters)) or 0
    total_pages: int = (total + PROJECTS_PER_PAGE - 1) // PROJECTS_PER_PAGE

    if total_pages > 0 and page > total_pages:
        return jsonify({"error": "Page not found", "page": page}), 404

    query = (
        select(Project)
        .where(*project_filters)
        .order_by(Project.created_at.desc())
        .offset((page - 1) * PROJECTS_PER_PAGE)
        .limit(PROJECTS_PER_PAGE)
    )
    projects: list[Project] = list(db.session.scalars(query).all())

    return jsonify(
        {
            "items": [serialize_project_card(project) for project in projects],
            "page": page,
            "pageSize": PROJECTS_PER_PAGE,
            "total": total,
            "totalPages": total_pages,
            "filter": project_filter,
        }
    )


@api_bp.get("/projects/<string:slug>")
def get_project(slug: str) -> Response:
    query = select(Project).where(Project.slug == slug, Project.is_published.is_(True))
    project: Project | None = db.session.scalars(query).first()

    if project is None:
        return jsonify({"error": "Project not found", "slug": slug}), 404

    return jsonify(serialize_project_detail(project))


@api_bp.get("/reportings")
def list_reportings() -> Response:
    reportings: list[Reporting] = list(
        db.session.scalars(select(Reporting).order_by(Reporting.year.desc())).all()
    )

    return jsonify({"items": [serialize_reporting(reporting) for reporting in reportings]})

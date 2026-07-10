from flask import Blueprint, Response, jsonify
from sqlalchemy import select

from app.extensions import db
from app.models import Project
from app.serialization import serialize_project_card, serialize_project_detail

api_bp: Blueprint = Blueprint("api", __name__, url_prefix="/api")


@api_bp.get("/health")
def health() -> Response:
    return jsonify({"status": "ok"})


@api_bp.get("/projects")
def list_projects() -> Response:
    query = select(Project).where(Project.is_published.is_(True)).order_by(Project.created_at.desc())
    projects: list[Project] = list(db.session.scalars(query).all())

    return jsonify([serialize_project_card(project) for project in projects])


@api_bp.get("/projects/<string:slug>")
def get_project(slug: str) -> Response:
    query = select(Project).where(Project.slug == slug, Project.is_published.is_(True))
    project: Project | None = db.session.scalars(query).first()

    if project is None:
        return jsonify({"error": "Project not found", "slug": slug}), 404

    return jsonify(serialize_project_detail(project))

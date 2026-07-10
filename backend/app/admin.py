from pathlib import Path
from uuid import uuid4

from flask import Response, current_app, redirect, request, url_for
from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from markupsafe import Markup
from wtforms import BooleanField, IntegerField, StringField, TextAreaField
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app.extensions import admin, db
from app.models import AdminUser, Project, ProjectImage, utc_now

ALLOWED_IMAGE_EXTENSIONS: set[str] = {"jpg", "jpeg", "png", "webp"}


def _is_allowed_image(filename: str) -> bool:
    suffix: str = Path(filename).suffix.lower().replace(".", "")
    return suffix in ALLOWED_IMAGE_EXTENSIONS


def _create_upload_filename(original_filename: str) -> str:
    safe_filename: str = secure_filename(original_filename)
    suffix: str = Path(safe_filename).suffix.lower()

    if suffix == "":
        raise ValueError("Uploaded image must have a file extension.")

    return f"{uuid4().hex}{suffix}"


class ProtectedModelView(ModelView):
    can_view_details = True

    def is_accessible(self) -> bool:
        return current_user.is_authenticated

    def inaccessible_callback(self, name: str, **kwargs: object) -> Response:
        return redirect(url_for("auth.login", next=request.url))


class ProjectAdminView(ProtectedModelView):
    column_list = (
        "title",
        "customer",
        "industry",
        "territory",
        "start_year",
        "end_year",
        "is_published",
    )
    column_searchable_list = ("title", "customer", "industry", "territory")
    column_filters = ("industry", "territory", "is_published")
    form_columns = (
        "title",
        "slug",
        "customer",
        "contract_subject",
        "industry",
        "territory",
        "start_year",
        "end_year",
        "short_description",
        "full_description",
        "cover_image_url",
        "is_published",
    )
    form_overrides = {
        "title": StringField,
        "slug": StringField,
        "customer": StringField,
        "contract_subject": TextAreaField,
        "industry": StringField,
        "territory": StringField,
        "start_year": IntegerField,
        "end_year": IntegerField,
        "short_description": TextAreaField,
        "full_description": TextAreaField,
        "cover_image_url": StringField,
        "is_published": BooleanField,
    }

    def on_model_change(
        self,
        form: object,
        model: Project,
        is_created: bool,
    ) -> None:
        timestamp = utc_now()

        if is_created:
            model.created_at = timestamp

        model.updated_at = timestamp


class ProjectImageAdminView(ProtectedModelView):
    column_list = ("project", "image_url", "alt_text", "sort_order", "preview")
    column_searchable_list = ("alt_text", "image_url")
    column_filters = ("project",)
    form_columns = ("project", "image_url", "alt_text", "sort_order")
    form_overrides = {
        "image_url": StringField,
        "alt_text": StringField,
        "sort_order": IntegerField,
    }

    def _preview_formatter(
        self,
        context: object,
        model: ProjectImage,
        name: str,
    ) -> Markup:
        return Markup(f'<img src="{model.image_url}" alt="{model.alt_text}" style="max-width: 140px;">')

    column_formatters = {"preview": _preview_formatter}

    def on_model_change(
        self,
        form: object,
        model: ProjectImage,
        is_created: bool,
    ) -> None:
        if is_created:
            model.created_at = utc_now()


class AdminUserView(ProtectedModelView):
    column_list = ("email", "is_active_admin", "created_at")
    column_searchable_list = ("email",)
    form_columns = ("email", "is_active_admin")


class UploadAdminView(BaseView):
    @expose("/", methods=("GET", "POST"))
    def index(self) -> str | Response:
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login", next=request.url))

        uploaded_url: str = ""

        if request.method == "POST":
            uploaded_file: FileStorage | None = request.files.get("image")

            if uploaded_file is None or uploaded_file.filename is None:
                raise ValueError("Missing uploaded image file.")

            if not _is_allowed_image(uploaded_file.filename):
                raise ValueError("Only jpg, jpeg, png, and webp images are allowed.")

            upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
            upload_filename: str = _create_upload_filename(uploaded_file.filename)
            upload_path: Path = upload_folder / upload_filename
            uploaded_file.save(upload_path)
            uploaded_url = url_for("uploaded_file", filename=upload_filename)

        return self.render("admin/upload.html", uploaded_url=uploaded_url)


def setup_admin_views() -> None:
    admin.add_view(ProjectAdminView(Project, db.session, category="Projects"))
    admin.add_view(ProjectImageAdminView(ProjectImage, db.session, category="Projects"))
    admin.add_view(UploadAdminView(name="Upload Image", endpoint="upload-image", category="Projects"))
    admin.add_view(AdminUserView(AdminUser, db.session, category="System"))

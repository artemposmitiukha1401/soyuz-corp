from pathlib import Path
from uuid import uuid4

from flask import Response, current_app, redirect, request, url_for
from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from markupsafe import Markup, escape
from PIL import Image, UnidentifiedImageError
from wtforms import BooleanField, IntegerField, StringField, TextAreaField
from wtforms.validators import Length, NumberRange
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app.extensions import admin, db
from app.models import AdminUser, Project, ProjectImage, utc_now
from app.validation import (
    MAX_IMAGE_DIMENSION,
    MAX_PROJECT_YEAR,
    MIN_PROJECT_YEAR,
    validate_image_url,
    validate_project_image_values,
    validate_project_values,
    validate_required_text,
    validate_slug,
)

ALLOWED_IMAGE_EXTENSIONS: set[str] = {"jpg", "jpeg", "png", "webp"}
IMAGE_FORMAT_BY_EXTENSION: dict[str, str] = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
    "webp": "WEBP",
}


def _is_allowed_image(filename: str) -> bool:
    suffix: str = Path(filename).suffix.lower().replace(".", "")
    return suffix in ALLOWED_IMAGE_EXTENSIONS


def _create_upload_filename(original_filename: str) -> str:
    safe_filename: str = secure_filename(original_filename)
    suffix: str = Path(safe_filename).suffix.lower()

    if suffix == "":
        raise ValueError("Uploaded image must have a file extension.")

    return f"{uuid4().hex}{suffix}"


def _verify_uploaded_image(uploaded_file: FileStorage) -> None:
    filename: str = uploaded_file.filename or ""
    extension: str = Path(filename).suffix.lower().removeprefix(".")
    expected_format: str = IMAGE_FORMAT_BY_EXTENSION[extension]

    try:
        with Image.open(uploaded_file.stream) as image:
            image_format: str | None = image.format
            width, height = image.size
            image.verify()
    except (Image.DecompressionBombError, UnidentifiedImageError, OSError) as error:
        raise ValueError("Uploaded file is not a valid image.") from error
    finally:
        uploaded_file.stream.seek(0)

    if image_format != expected_format:
        raise ValueError("Image content does not match its filename extension.")

    if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
        raise ValueError(f"Image dimensions cannot exceed {MAX_IMAGE_DIMENSION} pixels.")


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
    form_args = {
        "title": {"validators": [validate_required_text, Length(max=255)]},
        "slug": {"validators": [validate_required_text, Length(max=255), validate_slug]},
        "customer": {"validators": [validate_required_text, Length(max=255)]},
        "contract_subject": {"validators": [validate_required_text]},
        "industry": {"validators": [validate_required_text, Length(max=255)]},
        "territory": {"validators": [validate_required_text, Length(max=255)]},
        "start_year": {"validators": [NumberRange(min=MIN_PROJECT_YEAR, max=MAX_PROJECT_YEAR)]},
        "end_year": {"validators": [NumberRange(min=MIN_PROJECT_YEAR, max=MAX_PROJECT_YEAR)]},
        "short_description": {"validators": [validate_required_text]},
        "full_description": {"validators": [validate_required_text]},
        "cover_image_url": {"validators": [validate_required_text, Length(max=500), validate_image_url]},
    }

    def on_model_change(
        self,
        form: object,
        model: Project,
        is_created: bool,
    ) -> None:
        validate_project_values(
            title=model.title,
            slug=model.slug,
            customer=model.customer,
            contract_subject=model.contract_subject,
            industry=model.industry,
            territory=model.territory,
            start_year=model.start_year,
            end_year=model.end_year,
            short_description=model.short_description,
            full_description=model.full_description,
            cover_image_url=model.cover_image_url,
        )
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
    form_args = {
        "image_url": {"validators": [validate_required_text, Length(max=500), validate_image_url]},
        "alt_text": {"validators": [validate_required_text, Length(max=255)]},
        "sort_order": {"validators": [NumberRange(min=0)]},
    }

    def _preview_formatter(
        self,
        context: object,
        model: ProjectImage,
        name: str,
    ) -> Markup:
        image_url: Markup = escape(model.image_url)
        alt_text: Markup = escape(model.alt_text)
        return Markup('<img src="{}" alt="{}" style="max-width: 140px;">').format(
            image_url,
            alt_text,
        )

    column_formatters = {"preview": _preview_formatter}

    def on_model_change(
        self,
        form: object,
        model: ProjectImage,
        is_created: bool,
    ) -> None:
        validate_project_image_values(
            image_url=model.image_url,
            alt_text=model.alt_text,
            sort_order=model.sort_order,
        )
        if is_created:
            model.created_at = utc_now()


class AdminUserView(ProtectedModelView):
    can_create = False
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

            _verify_uploaded_image(uploaded_file)

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

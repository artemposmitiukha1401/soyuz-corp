from pathlib import Path
from uuid import uuid4

from flask import Response, current_app, redirect, request, url_for
from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from markupsafe import Markup, escape
from PIL import Image, UnidentifiedImageError
from sqlalchemy import func, select
from wtforms import BooleanField, IntegerField, StringField, TextAreaField
from wtforms.validators import Length, NumberRange
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app.config import R2Config
from app.extensions import admin, db
from app.models import AdminUser, Project, ProjectImage, Reporting, ReportingDocument, utc_now
from app.r2 import (
    GalleryImage,
    delete_gallery_image,
    delete_project_cover_image,
    delete_project_image,
    delete_reporting_document,
    list_gallery_images,
    upload_gallery_image,
    upload_project_cover_image,
    upload_project_image,
    upload_reporting_document,
)
from app.validation import (
    MAX_IMAGE_DIMENSION,
    MAX_PROJECT_YEAR,
    MIN_PROJECT_YEAR,
    normalize_optional_image_url,
    validate_image_url,
    validate_optional_image_url,
    validate_project_image_values,
    validate_project_values,
    validate_required_text,
    validate_slug,
)

ALLOWED_IMAGE_EXTENSIONS: set[str] = {"jpg", "jpeg", "png", "webp"}
ALLOWED_REPORTING_DOCUMENT_EXTENSIONS: frozenset[str] = frozenset({"pdf"})
IMAGE_FORMAT_BY_EXTENSION: dict[str, str] = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
    "webp": "WEBP",
}
IMAGE_CONTENT_TYPE_BY_EXTENSION: dict[str, str] = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
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


def _get_r2_config() -> R2Config:
    config: object | None = current_app.config.get("R2_CONFIG")

    if not isinstance(config, R2Config):
        raise RuntimeError("R2 configuration is unavailable.")

    return config


def _read_selected_project() -> Project:
    raw_project_id: str | None = request.form.get("project_id")

    if raw_project_id is None or not raw_project_id.isdecimal():
        raise ValueError("Project ID must be a positive integer.")

    project_id: int = int(raw_project_id)
    if project_id <= 0:
        raise ValueError("Project ID must be a positive integer.")

    project: Project | None = db.session.get(Project, project_id)
    if project is None:
        raise ValueError(f"Project not found: id={project_id}.")

    return project


def _read_uploaded_image() -> tuple[FileStorage, str, str]:
    uploaded_file: FileStorage | None = request.files.get("image")

    if uploaded_file is None or uploaded_file.filename is None:
        raise ValueError("Missing image file.")

    if not _is_allowed_image(uploaded_file.filename):
        raise ValueError("Only jpg, jpeg, png, and webp images are allowed.")

    _verify_uploaded_image(uploaded_file)
    upload_filename: str = _create_upload_filename(uploaded_file.filename)
    extension: str = Path(upload_filename).suffix.lower().removeprefix(".")
    return uploaded_file, upload_filename, IMAGE_CONTENT_TYPE_BY_EXTENSION[extension]


def _read_reporting_year() -> int:
    raw_year: str | None = request.form.get("year")

    if raw_year is None or not raw_year.isdecimal():
        raise ValueError("Reporting year must be a whole number.")

    year: int = int(raw_year)
    if not MIN_PROJECT_YEAR <= year <= MAX_PROJECT_YEAR:
        raise ValueError(
            f"Reporting year must be between {MIN_PROJECT_YEAR} and {MAX_PROJECT_YEAR}."
        )

    return year


def _read_reporting_label() -> str:
    label: str = (request.form.get("label") or "").strip()

    if label == "":
        raise ValueError("Document label cannot be empty.")

    if len(label) > 255:
        raise ValueError("Document label cannot exceed 255 characters.")

    return label


def _read_uploaded_reporting_document() -> tuple[FileStorage, str]:
    uploaded_file: FileStorage | None = request.files.get("document")

    if uploaded_file is None or uploaded_file.filename is None:
        raise ValueError("Missing PDF document.")

    extension: str = Path(uploaded_file.filename).suffix.lower().removeprefix(".")
    if extension not in ALLOWED_REPORTING_DOCUMENT_EXTENSIONS:
        raise ValueError("Only PDF documents are allowed.")

    signature: bytes = uploaded_file.stream.read(5)
    uploaded_file.stream.seek(0)

    if signature != b"%PDF-":
        raise ValueError("Uploaded file is not a valid PDF document.")

    return uploaded_file, f"{uuid4().hex}.pdf"


def _get_next_project_image_sort_order(project_id: int) -> int:
    highest_sort_order: int | None = db.session.scalar(
        select(func.max(ProjectImage.sort_order)).where(ProjectImage.project_id == project_id)
    )

    return 0 if highest_sort_order is None else highest_sort_order + 1


def _read_alt_text() -> str:
    alt_text: str = (request.form.get("alt_text") or "").strip()

    if alt_text == "":
        raise ValueError("Alt text cannot be empty.")

    if len(alt_text) > 255:
        raise ValueError("Alt text cannot exceed 255 characters.")

    return alt_text


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
        "is_big_project",
        "is_published",
    )
    column_searchable_list = ("title", "customer", "industry", "territory")
    column_filters = ("industry", "territory", "is_big_project", "is_published")
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
        "is_big_project",
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
        "is_big_project": BooleanField,
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
        "cover_image_url": {"validators": [Length(max=500), validate_optional_image_url]},
    }

    def on_model_change(
        self,
        form: object,
        model: Project,
        is_created: bool,
    ) -> None:
        model.cover_image_url = normalize_optional_image_url(model.cover_image_url)
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
    can_create = False
    fast_mass_delete = False
    column_list = ("project", "image_url", "alt_text", "sort_order", "preview")
    column_searchable_list = ("alt_text", "image_url")
    column_filters = ("project",)
    form_columns = ("image_url", "alt_text")
    form_overrides = {
        "image_url": StringField,
        "alt_text": StringField,
    }
    form_args = {
        "image_url": {"validators": [validate_required_text, Length(max=500), validate_image_url]},
        "alt_text": {"validators": [validate_required_text, Length(max=255)]},
    }

    def is_visible(self) -> bool:
        return False

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

    def on_model_delete(self, model: ProjectImage) -> None:
        delete_project_image(
            config=_get_r2_config(),
            project_id=model.project_id,
            image_url=model.image_url,
        )


class ProjectImagesAdminView(BaseView):
    def is_accessible(self) -> bool:
        return current_user.is_authenticated

    def inaccessible_callback(self, name: str, **kwargs: object) -> Response:
        return redirect(url_for("auth.login", next=request.url))

    @expose("/", methods=("GET",))
    def index(self) -> str:
        projects: list[Project] = list(db.session.scalars(select(Project).order_by(Project.title)).all())
        image_counts: dict[int, int] = {
            project_id: image_count
            for project_id, image_count in db.session.execute(
                select(ProjectImage.project_id, func.count(ProjectImage.id)).group_by(
                    ProjectImage.project_id
                )
            ).all()
        }

        return self.render(
            "admin/project-images.html",
            projects=projects,
            image_counts=image_counts,
        )

    @expose("/<int:project_id>/", methods=("GET", "POST"))
    def project_detail(self, project_id: int) -> str | Response:
        project: Project | None = db.session.get(Project, project_id)
        if project is None:
            raise ValueError(f"Project not found: id={project_id}.")

        if request.method == "POST":
            action: str | None = request.form.get("action")

            if action == "delete-cover":
                cover_image_url: str | None = project.cover_image_url

                if cover_image_url is None:
                    raise ValueError(f"Project has no cover image: id={project.id}.")

                delete_project_cover_image(
                    config=_get_r2_config(),
                    project_id=project.id,
                    image_url=cover_image_url,
                )
                project.cover_image_url = None
                project.updated_at = utc_now()
                db.session.commit()
                return redirect(url_for("project-images.project_detail", project_id=project.id))

            if action != "delete-image":
                raise ValueError("Unknown project image action.")

            raw_image_id: str | None = request.form.get("image_id")
            if raw_image_id is None or not raw_image_id.isdecimal():
                raise ValueError("Project image ID must be a positive integer.")

            image_id: int = int(raw_image_id)
            image: ProjectImage | None = db.session.get(ProjectImage, image_id)

            if image is None or image.project_id != project.id:
                raise ValueError(f"Project image not found: id={image_id}.")

            delete_project_image(
                config=_get_r2_config(),
                project_id=project.id,
                image_url=image.image_url,
            )
            db.session.delete(image)
            project.updated_at = utc_now()
            db.session.commit()
            return redirect(url_for("project-images.project_detail", project_id=project.id))

        images: list[ProjectImage] = list(
            db.session.scalars(
                select(ProjectImage)
                .where(ProjectImage.project_id == project.id)
                .order_by(ProjectImage.sort_order)
            ).all()
        )
        return self.render("admin/project-images-detail.html", project=project, images=images)


class ReportingAdminView(BaseView):
    def is_accessible(self) -> bool:
        return current_user.is_authenticated

    def inaccessible_callback(self, name: str, **kwargs: object) -> Response:
        return redirect(url_for("auth.login", next=request.url))

    @expose("/", methods=("GET", "POST"))
    def index(self) -> str | Response:
        if request.method == "POST":
            action: str | None = request.form.get("action")

            if action == "create-reporting":
                year: int = _read_reporting_year()
                existing_reporting: Reporting | None = db.session.scalars(
                    select(Reporting).where(Reporting.year == year)
                ).first()

                if existing_reporting is not None:
                    raise ValueError(f"Reporting already exists for year {year}.")

                reporting: Reporting = Reporting(year=year, created_at=utc_now())
                db.session.add(reporting)
                db.session.commit()
                return redirect(url_for("reportings.reporting_detail", reporting_id=reporting.id))

            if action == "delete-reporting":
                raw_reporting_id: str | None = request.form.get("reporting_id")

                if raw_reporting_id is None or not raw_reporting_id.isdecimal():
                    raise ValueError("Reporting ID must be a positive integer.")

                reporting_id: int = int(raw_reporting_id)
                reporting: Reporting | None = db.session.get(Reporting, reporting_id)
                if reporting is None:
                    raise ValueError(f"Reporting not found: id={reporting_id}.")

                for document in reporting.documents:
                    delete_reporting_document(_get_r2_config(), document.storage_key)

                db.session.delete(reporting)
                db.session.commit()
                return redirect(url_for("reportings.index"))

            raise ValueError("Unknown reporting action.")

        reportings: list[Reporting] = list(
            db.session.scalars(select(Reporting).order_by(Reporting.year.desc())).all()
        )
        document_counts: dict[int, int] = {
            reporting_id: document_count
            for reporting_id, document_count in db.session.execute(
                select(ReportingDocument.reporting_id, func.count(ReportingDocument.id)).group_by(
                    ReportingDocument.reporting_id
                )
            ).all()
        }

        return self.render(
            "admin/reportings.html",
            reportings=reportings,
            document_counts=document_counts,
        )

    @expose("/<int:reporting_id>/", methods=("GET", "POST"))
    def reporting_detail(self, reporting_id: int) -> str | Response:
        reporting: Reporting | None = db.session.get(Reporting, reporting_id)
        if reporting is None:
            raise ValueError(f"Reporting not found: id={reporting_id}.")

        if request.method == "POST":
            action: str | None = request.form.get("action")

            if action == "upload-document":
                label: str = _read_reporting_label()
                uploaded_file: FileStorage
                upload_filename: str
                uploaded_file, upload_filename = _read_uploaded_reporting_document()
                stored_document = upload_reporting_document(
                    config=_get_r2_config(),
                    year=reporting.year,
                    filename=upload_filename,
                    file_stream=uploaded_file.stream,
                )
                db.session.add(
                    ReportingDocument(
                        reporting_id=reporting.id,
                        label=label,
                        file_url=stored_document.url,
                        storage_key=stored_document.key,
                        created_at=utc_now(),
                    )
                )
                db.session.commit()
                return redirect(url_for("reportings.reporting_detail", reporting_id=reporting.id))

            if action == "delete-document":
                raw_document_id: str | None = request.form.get("document_id")
                if raw_document_id is None or not raw_document_id.isdecimal():
                    raise ValueError("Document ID must be a positive integer.")

                document_id: int = int(raw_document_id)
                document: ReportingDocument | None = db.session.get(ReportingDocument, document_id)
                if document is None or document.reporting_id != reporting.id:
                    raise ValueError(f"Reporting document not found: id={document_id}.")

                delete_reporting_document(_get_r2_config(), document.storage_key)
                db.session.delete(document)
                db.session.commit()
                return redirect(url_for("reportings.reporting_detail", reporting_id=reporting.id))

            raise ValueError("Unknown reporting document action.")

        documents: list[ReportingDocument] = list(
            db.session.scalars(
                select(ReportingDocument)
                .where(ReportingDocument.reporting_id == reporting.id)
                .order_by(ReportingDocument.created_at)
            ).all()
        )
        return self.render(
            "admin/reporting-detail.html",
            reporting=reporting,
            documents=documents,
        )


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


class ProjectCoverUploadAdminView(BaseView):
    @expose("/", methods=("GET", "POST"))
    def index(self) -> str | Response:
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login", next=request.url))

        uploaded_url: str = ""

        if request.method == "POST":
            project: Project = _read_selected_project()
            uploaded_file: FileStorage
            upload_filename: str
            content_type: str
            uploaded_file, upload_filename, content_type = _read_uploaded_image()
            uploaded_url = upload_project_cover_image(
                config=_get_r2_config(),
                project_id=project.id,
                filename=upload_filename,
                content_type=content_type,
                file_stream=uploaded_file.stream,
            )
            project.cover_image_url = uploaded_url
            project.updated_at = utc_now()
            db.session.commit()

        projects: list[Project] = list(db.session.scalars(select(Project).order_by(Project.title)).all())
        return self.render(
            "admin/project-cover-upload.html",
            projects=projects,
            uploaded_url=uploaded_url,
        )


class ProjectImageUploadAdminView(BaseView):
    @expose("/", methods=("GET", "POST"))
    def index(self) -> str | Response:
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login", next=request.url))

        uploaded_url: str = ""

        if request.method == "POST":
            project: Project = _read_selected_project()
            alt_text: str = _read_alt_text()
            sort_order: int = _get_next_project_image_sort_order(project.id)
            uploaded_file: FileStorage
            upload_filename: str
            content_type: str
            uploaded_file, upload_filename, content_type = _read_uploaded_image()
            uploaded_url = upload_project_image(
                config=_get_r2_config(),
                project_id=project.id,
                filename=upload_filename,
                content_type=content_type,
                file_stream=uploaded_file.stream,
            )
            project_image: ProjectImage = ProjectImage(
                project_id=project.id,
                image_url=uploaded_url,
                alt_text=alt_text,
                sort_order=sort_order,
                created_at=utc_now(),
            )
            project.updated_at = utc_now()
            db.session.add(project_image)
            db.session.commit()

        projects: list[Project] = list(db.session.scalars(select(Project).order_by(Project.title)).all())
        return self.render(
            "admin/project-image-upload.html",
            projects=projects,
            uploaded_url=uploaded_url,
        )


class GalleryUploadAdminView(BaseView):
    @expose("/", methods=("GET", "POST"))
    def index(self) -> str | Response:
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login", next=request.url))

        uploaded_url: str = ""

        if request.method == "POST":
            action: str | None = request.form.get("action")

            if action == "delete":
                image_key: str | None = request.form.get("image_key")

                if image_key is None or image_key.strip() == "":
                    raise ValueError("Missing gallery image key.")

                delete_gallery_image(_get_r2_config(), image_key)
            elif action == "upload":
                uploaded_file: FileStorage | None = request.files.get("image")

                if uploaded_file is None or uploaded_file.filename is None:
                    raise ValueError("Missing gallery image file.")

                if not _is_allowed_image(uploaded_file.filename):
                    raise ValueError("Only jpg, jpeg, png, and webp images are allowed.")

                _verify_uploaded_image(uploaded_file)
                upload_filename: str = _create_upload_filename(uploaded_file.filename)
                extension: str = Path(upload_filename).suffix.lower().removeprefix(".")
                gallery_image: GalleryImage = upload_gallery_image(
                    config=_get_r2_config(),
                    filename=upload_filename,
                    content_type=IMAGE_CONTENT_TYPE_BY_EXTENSION[extension],
                    file_stream=uploaded_file.stream,
                )
                uploaded_url = gallery_image.url
            else:
                raise ValueError("Unknown gallery action.")

        gallery_images: list[GalleryImage] = list_gallery_images(_get_r2_config())
        return self.render(
            "admin/gallery-upload.html",
            gallery_images=gallery_images,
            uploaded_url=uploaded_url,
        )


def setup_admin_views() -> None:
    admin.add_view(ProjectAdminView(Project, db.session, category="Projects"))
    admin.add_view(ProjectImageAdminView(ProjectImage, db.session, category="Projects"))
    admin.add_view(
        ProjectImagesAdminView(
            name="Project Images",
            endpoint="project-images",
            category="Projects",
        )
    )
    admin.add_view(
        ProjectCoverUploadAdminView(
            name="Upload Cover Image",
            endpoint="project-cover-upload",
            category="Projects",
        )
    )
    admin.add_view(
        ProjectImageUploadAdminView(
            name="Upload Project Image",
            endpoint="project-image-upload",
            category="Projects",
        )
    )
    admin.add_view(
        GalleryUploadAdminView(name="Upload Images", endpoint="gallery-upload", category="Gallery")
    )
    admin.add_view(
        ReportingAdminView(name="Reportings", endpoint="reportings", category="Reporting")
    )
    admin.add_view(AdminUserView(AdminUser, db.session, category="System"))

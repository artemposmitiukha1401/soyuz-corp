import re
from urllib.parse import urlparse

from wtforms import ValidationError
from wtforms.fields import Field

MIN_PROJECT_YEAR: int = 1900
MAX_PROJECT_YEAR: int = 2100
MAX_IMAGE_DIMENSION: int = 10_000
SLUG_PATTERN: re.Pattern[str] = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _require_text(value: str, field_name: str) -> None:
    if value.strip() == "":
        raise ValueError(f"{field_name} cannot be empty.")


def is_allowed_image_url(value: str) -> bool:
    if value == "" or any(character.isspace() for character in value):
        return False

    if value.startswith("/uploads/"):
        normalized_value: str = value.lower()
        return len(value) > len("/uploads/") and ".." not in normalized_value and "%2e" not in normalized_value

    parsed_url = urlparse(value)
    try:
        hostname: str | None = parsed_url.hostname
    except ValueError:
        return False

    return parsed_url.scheme in {"http", "https"} and hostname is not None


def validate_project_values(
    title: str,
    slug: str,
    customer: str,
    contract_subject: str,
    industry: str,
    territory: str,
    start_year: int,
    end_year: int,
    short_description: str,
    full_description: str,
    cover_image_url: str,
) -> None:
    required_text_fields: tuple[tuple[str, str], ...] = (
        (title, "Title"),
        (customer, "Customer"),
        (contract_subject, "Contract subject"),
        (industry, "Industry"),
        (territory, "Territory"),
        (short_description, "Short description"),
        (full_description, "Full description"),
    )

    for value, field_name in required_text_fields:
        _require_text(value, field_name)

    if not SLUG_PATTERN.fullmatch(slug):
        raise ValueError("Slug must use lowercase letters, numbers, and single hyphens only.")

    if not MIN_PROJECT_YEAR <= start_year <= MAX_PROJECT_YEAR:
        raise ValueError(f"Start year must be between {MIN_PROJECT_YEAR} and {MAX_PROJECT_YEAR}.")

    if not MIN_PROJECT_YEAR <= end_year <= MAX_PROJECT_YEAR:
        raise ValueError(f"End year must be between {MIN_PROJECT_YEAR} and {MAX_PROJECT_YEAR}.")

    if start_year > end_year:
        raise ValueError("Start year cannot be later than end year.")

    if not is_allowed_image_url(cover_image_url):
        raise ValueError("Cover image must be an HTTP(S) URL or an uploaded /uploads/ path.")


def validate_project_image_values(image_url: str, alt_text: str, sort_order: int) -> None:
    _require_text(alt_text, "Image alt text")

    if sort_order < 0:
        raise ValueError("Image sort order cannot be negative.")

    if not is_allowed_image_url(image_url):
        raise ValueError("Image URL must be an HTTP(S) URL or an uploaded /uploads/ path.")


def validate_required_text(form: object, field: Field) -> None:
    value: object = field.data
    if not isinstance(value, str) or value.strip() == "":
        raise ValidationError("This field cannot be empty.")


def validate_slug(form: object, field: Field) -> None:
    value: object = field.data
    if not isinstance(value, str) or not SLUG_PATTERN.fullmatch(value):
        raise ValidationError("Use lowercase letters, numbers, and single hyphens only.")


def validate_image_url(form: object, field: Field) -> None:
    value: object = field.data
    if not isinstance(value, str) or not is_allowed_image_url(value):
        raise ValidationError("Use an HTTP(S) URL or an uploaded /uploads/ path.")

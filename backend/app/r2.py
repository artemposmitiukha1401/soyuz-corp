from dataclasses import dataclass
from pathlib import PurePosixPath
from typing import BinaryIO, Mapping
from urllib.parse import quote

import boto3
from botocore.client import BaseClient

from app.config import R2Config

GALLERY_PREFIX: str = "gallery/"
PROJECT_IMAGES_PREFIX: str = "projects-images/"
REPORTING_DOCUMENTS_PREFIX: str = "documents/"
IMAGE_EXTENSIONS: frozenset[str] = frozenset({".avif", ".jpeg", ".jpg", ".png", ".webp"})


@dataclass(frozen=True)
class GalleryImage:
    key: str
    url: str
    alt_text: str


@dataclass(frozen=True)
class ReportingDocumentStorage:
    key: str
    url: str


def create_r2_client(config: R2Config) -> BaseClient:
    return boto3.client(
        service_name="s3",
        endpoint_url=f"https://{config.account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=config.access_key_id,
        aws_secret_access_key=config.secret_access_key,
        region_name="auto",
    )


def _is_gallery_image_key(key: str) -> bool:
    path: PurePosixPath = PurePosixPath(key)
    return key.startswith(GALLERY_PREFIX) and path.suffix.lower() in IMAGE_EXTENSIONS


def _create_alt_text(key: str) -> str:
    filename: str = PurePosixPath(key).stem
    return filename.replace("-", " ").replace("_", " ")


def _create_project_image_key(project_id: int, folder: str, filename: str) -> str:
    if project_id <= 0:
        raise ValueError("Project ID must be a positive integer.")

    return f"{PROJECT_IMAGES_PREFIX}{project_id}/{folder}/{filename}"


def _upload_image(
    config: R2Config,
    key: str,
    content_type: str,
    file_stream: BinaryIO,
) -> str:
    client: BaseClient = create_r2_client(config)
    client.put_object(
        Bucket=config.bucket_name,
        Key=key,
        Body=file_stream,
        ContentType=content_type,
    )

    return f"{config.public_base_url}/{quote(key, safe='/')}"


def upload_gallery_image(
    config: R2Config,
    filename: str,
    content_type: str,
    file_stream: BinaryIO,
) -> GalleryImage:
    key: str = f"{GALLERY_PREFIX}{filename}"
    url: str = _upload_image(config, key, content_type, file_stream)

    return GalleryImage(
        key=key,
        url=url,
        alt_text=_create_alt_text(key),
    )


def upload_project_cover_image(
    config: R2Config,
    project_id: int,
    filename: str,
    content_type: str,
    file_stream: BinaryIO,
) -> str:
    key: str = _create_project_image_key(project_id, "cover", filename)
    return _upload_image(config, key, content_type, file_stream)


def upload_project_image(
    config: R2Config,
    project_id: int,
    filename: str,
    content_type: str,
    file_stream: BinaryIO,
) -> str:
    key: str = _create_project_image_key(project_id, "images", filename)
    return _upload_image(config, key, content_type, file_stream)


def upload_reporting_document(
    config: R2Config,
    year: int,
    filename: str,
    file_stream: BinaryIO,
) -> ReportingDocumentStorage:
    if not 1900 <= year <= 2100:
        raise ValueError("Reporting year must be between 1900 and 2100.")

    key: str = f"{REPORTING_DOCUMENTS_PREFIX}{year}/{filename}"
    url: str = _upload_image(config, key, "application/pdf", file_stream)
    return ReportingDocumentStorage(key=key, url=url)


def build_project_image_url(config: R2Config, project_id: int, filename: str) -> str:
    key: str = _create_project_image_key(project_id, "images", filename)
    return f"{config.public_base_url}/{quote(key, safe='/')}"


def delete_gallery_image(config: R2Config, key: str) -> None:
    if not _is_gallery_image_key(key):
        raise ValueError("Only image files in the gallery folder can be deleted.")

    client: BaseClient = create_r2_client(config)
    client.delete_object(Bucket=config.bucket_name, Key=key)


def delete_project_image(config: R2Config, project_id: int, image_url: str) -> None:
    project_image_prefix: str = f"{PROJECT_IMAGES_PREFIX}{project_id}/images/"
    public_url_prefix: str = f"{config.public_base_url}/{project_image_prefix}"

    if not image_url.startswith(public_url_prefix):
        return

    key: str = image_url.removeprefix(f"{config.public_base_url}/")
    client: BaseClient = create_r2_client(config)
    client.delete_object(Bucket=config.bucket_name, Key=key)


def delete_project_cover_image(config: R2Config, project_id: int, image_url: str) -> None:
    project_cover_prefix: str = f"{PROJECT_IMAGES_PREFIX}{project_id}/cover/"
    public_url_prefix: str = f"{config.public_base_url}/{project_cover_prefix}"

    if not image_url.startswith(public_url_prefix):
        return

    key: str = image_url.removeprefix(f"{config.public_base_url}/")
    client: BaseClient = create_r2_client(config)
    client.delete_object(Bucket=config.bucket_name, Key=key)


def delete_reporting_document(config: R2Config, storage_key: str) -> None:
    path: PurePosixPath = PurePosixPath(storage_key)

    if not storage_key.startswith(REPORTING_DOCUMENTS_PREFIX) or path.suffix.lower() != ".pdf":
        raise ValueError("Only PDF files in the documents folder can be deleted.")

    client: BaseClient = create_r2_client(config)
    client.delete_object(Bucket=config.bucket_name, Key=storage_key)


def _read_image_key(value: object) -> str | None:
    if not isinstance(value, Mapping):
        return None

    key: object | None = value.get("Key")
    if not isinstance(key, str) or not _is_gallery_image_key(key):
        return None

    return key


def list_gallery_images(config: R2Config) -> list[GalleryImage]:
    client: BaseClient = create_r2_client(config)
    images: list[GalleryImage] = []
    continuation_token: str | None = None

    while True:
        request_arguments: dict[str, str] = {
            "Bucket": config.bucket_name,
            "Prefix": GALLERY_PREFIX,
        }

        if continuation_token is not None:
            request_arguments["ContinuationToken"] = continuation_token

        response: Mapping[str, object] = client.list_objects_v2(**request_arguments)
        contents: object | None = response.get("Contents")

        if isinstance(contents, list):
            for object_info in contents:
                key: str | None = _read_image_key(object_info)

                if key is not None:
                    images.append(
                        GalleryImage(
                            key=key,
                            url=f"{config.public_base_url}/{quote(key, safe='/')}",
                            alt_text=_create_alt_text(key),
                        )
                    )

        is_truncated: object | None = response.get("IsTruncated")
        next_token: object | None = response.get("NextContinuationToken")

        if is_truncated is not True:
            break

        if not isinstance(next_token, str) or next_token == "":
            raise RuntimeError("R2 returned a truncated gallery listing without a continuation token.")

        continuation_token = next_token

    return sorted(images, key=lambda image: image.key)

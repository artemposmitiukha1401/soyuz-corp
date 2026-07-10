import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AppConfig:
    secret_key: str
    database_url: str
    frontend_origin: str
    upload_folder: Path
    max_content_length: int


def _read_required_env(name: str) -> str:
    value: str | None = os.environ.get(name)
    if value is None or value.strip() == "":
        raise RuntimeError(f"Missing required environment variable: {name}")

    return value


def _read_upload_folder(base_path: Path) -> Path:
    raw_upload_folder: str = _read_required_env("UPLOAD_FOLDER")
    upload_folder: Path = Path(raw_upload_folder)

    if upload_folder.is_absolute():
        return upload_folder

    return base_path / upload_folder


def load_config(base_path: Path) -> AppConfig:
    return AppConfig(
        secret_key=_read_required_env("SECRET_KEY"),
        database_url=_read_required_env("DATABASE_URL"),
        frontend_origin=_read_required_env("FRONTEND_ORIGIN"),
        upload_folder=_read_upload_folder(base_path),
        max_content_length=10 * 1024 * 1024,
    )

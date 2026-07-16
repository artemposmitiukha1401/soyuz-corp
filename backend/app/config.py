import os
from dataclasses import dataclass
from pathlib import Path

POSTGRESQL_URL_PREFIX: str = "postgresql://"
PSYCOPG3_URL_PREFIX: str = "postgresql+psycopg://"


@dataclass(frozen=True)
class R2Config:
    account_id: str
    access_key_id: str
    secret_access_key: str
    bucket_name: str
    public_base_url: str


@dataclass(frozen=True)
class AppConfig:
    secret_key: str
    database_url: str
    frontend_origin: str
    upload_folder: Path
    max_content_length: int
    r2: R2Config


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


def _use_psycopg3_driver(database_url: str) -> str:
    if database_url.startswith(POSTGRESQL_URL_PREFIX):
        return f"{PSYCOPG3_URL_PREFIX}{database_url.removeprefix(POSTGRESQL_URL_PREFIX)}"

    return database_url


def _read_r2_config() -> R2Config:
    public_base_url: str = _read_required_env("R2_PUBLIC_BASE_URL").rstrip("/")

    if not public_base_url.startswith("https://"):
        raise RuntimeError("R2_PUBLIC_BASE_URL must start with https://")

    return R2Config(
        account_id=_read_required_env("R2_ACCOUNT_ID"),
        access_key_id=_read_required_env("R2_ACCESS_KEY_ID"),
        secret_access_key=_read_required_env("R2_SECRET_ACCESS_KEY"),
        bucket_name=_read_required_env("R2_BUCKET_NAME"),
        public_base_url=public_base_url,
    )


def load_config(base_path: Path) -> AppConfig:
    return AppConfig(
        secret_key=_read_required_env("SECRET_KEY"),
        database_url=_use_psycopg3_driver(_read_required_env("DATABASE_URL")),
        frontend_origin=_read_required_env("FRONTEND_ORIGIN"),
        upload_folder=_read_upload_folder(base_path),
        max_content_length=10 * 1024 * 1024,
        r2=_read_r2_config(),
    )

from dataclasses import dataclass
from pathlib import Path
from random import Random

from sqlalchemy import func, select

from app.config import R2Config
from app.extensions import db
from app.models import Project, ProjectImage, utc_now
from app.r2 import build_project_image_url, upload_project_image

PROJECT_IMAGE_FOLDERS: dict[int, str] = {
    1: "Rekonstruktsiya_PL_750kV_KHAES_Zheshuv",
    2: "AVR_PL_330kV_Mykolaivska_Khersonska",
    3: "Rekonstruktsiya_PL_330kV_Adzhalyk_Trykhati",
    4: "Rekonstruktsiya_PS_330kV_Shepetivka_Kamyanets",
    5: "Budivnytstvo_FES_Inhulets",
    6: "Rekonstruktsiya_PL_150kV_GPP_Nova_Kakhovka_Dudchyno",
    7: "Rekonstruktsiya_PS_750kV_Vinnytska",
    8: "Tekhnichne_pereosnashchennya_PS_330kV_Novokyivska",
    9: "Rekonstruktsiya_PL_110kV_Adzhalyk_Berehova",
    10: "Budivnytstvo_PL_750kV_Rivnenska_AES_PS_750kV_Kyivska",
    11: "Budivnytstvo_KNS_6B_KNS_7A_Odesa",
    12: "Demontazh_budivel_PS_750kV_Kakhovska",
    13: "Budivnytstvo_PS_750kV_Kakhovska",
    14: "VRP_110kV_PS_330kV_Usatove_proektuvannya",
    15: "Rekonstruktsiya_VRP_110kV_PS_330kV_Usatove",
    16: "Rekonstruktsiya_TGV-200_Burshtynska_TES",
    17: "Rekonstruktsiya_elektrotekhnichnoho_oblad_Burshtynska_TES",
    18: "Rekonstruktsiya_PL_330kV_Adzhalyk_Usatove",
    19: "PL_110kV_Sonyachna_Artsyza",
    20: "PL_110kV_Sonyachna_Kiliya",
    21: "Rekonstruktsiya_PS_330kV_Usatove",
    22: "Rekonstruktsiya_PL_220kV_Centrolit_Kominternove",
    23: "Rekonstruktsiya_PS_220kV_Centrolit",
    24: "Rekonstruktsiya_PL_330kV_Kryvorizka_TES_Trykhati",
    25: "Rekonstruktsiya_PL_330kV_Moldavska_DRES_Kotovska",
    26: "Rekonstruktsiya_Energoblok7_Burshtynska_TES",
    27: "Rekonstruktsiya_PL_110kV_Usatove_Centrolit",
    28: "Zamina_Vymykachiv_PS_330kV_Trykhati",
    29: "Rekonstruktsiya_PS_330kV_VRP_110kV_Usatove",
    30: "Rekonstruktsiya_PL_110kV_Usatove_Chumka",
    31: "Demontazh_PL_330kV_Adzhalyk_Usatove",
    32: "Kapitalnyi_remont_PL_400kV_Moldavska_DRES_Vulkaneshty",
    33: "Budivnytstvo_Orlivska_VES",
    34: "Rekonstruktsiya_PS_220_35_10_Berezan",
    35: "Biomasa_Elektrostantsiya_Pereyaslav_Khmelnytskyi",
    36: "Biopalivo_Elektrostantsiya_Koryukivka",
    37: "Postachannya_ROU_PL_750kV_ZAES_Kakhovska",
}
IMAGE_CONTENT_TYPES: dict[str, str] = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}


@dataclass(frozen=True)
class ProjectImageImportSummary:
    imported_images: int
    skipped_images: int
    updated_covers: int


def _read_source_folders(source_root: Path) -> dict[str, Path]:
    source_folders: dict[str, Path] = {
        folder.name: folder for folder in source_root.iterdir() if folder.is_dir()
    }
    expected_folders: set[str] = set(PROJECT_IMAGE_FOLDERS.values())
    missing_folders: list[str] = sorted(expected_folders - source_folders.keys())
    unexpected_folders: list[str] = sorted(source_folders.keys() - expected_folders)

    if missing_folders:
        raise ValueError(f"Missing expected project image folders: {', '.join(missing_folders)}")

    if unexpected_folders:
        raise ValueError(f"Unexpected project image folders: {', '.join(unexpected_folders)}")

    return source_folders


def _read_image_paths(folder: Path) -> list[Path]:
    image_paths: list[Path] = sorted(
        (path for path in folder.iterdir() if path.is_file()),
        key=lambda path: path.name.casefold(),
    )

    if not image_paths:
        raise ValueError(f"Project image folder is empty: {folder}")

    unsupported_paths: list[Path] = [
        path for path in image_paths if path.suffix.lower() not in IMAGE_CONTENT_TYPES
    ]
    if unsupported_paths:
        unsupported_names: str = ", ".join(path.name for path in unsupported_paths)
        raise ValueError(f"Unsupported image files in {folder}: {unsupported_names}")

    return image_paths


def _read_project(legacy_id: int) -> Project:
    project_slug: str = f"legacy-project-{legacy_id}"
    project: Project | None = db.session.scalars(
        select(Project).where(Project.slug == project_slug)
    ).first()

    if project is None:
        raise ValueError(f"Missing seeded project for legacy ID {legacy_id}: slug={project_slug}")

    return project


def _get_next_sort_order(project_id: int) -> int:
    highest_sort_order: int | None = db.session.scalar(
        select(func.max(ProjectImage.sort_order)).where(ProjectImage.project_id == project_id)
    )
    return 0 if highest_sort_order is None else highest_sort_order + 1


def _create_import_filename(image_path: Path, position: int) -> str:
    return f"legacy-{position:03d}{image_path.suffix.lower()}"


def _create_alt_text(image_path: Path) -> str:
    return image_path.stem.replace("_", " ").replace("-", " ")


def import_project_images(source_root: Path, r2_config: R2Config) -> ProjectImageImportSummary:
    source_folders: dict[str, Path] = _read_source_folders(source_root)
    imported_images: int = 0
    skipped_images: int = 0
    updated_covers: int = 0

    try:
        for legacy_id, folder_name in PROJECT_IMAGE_FOLDERS.items():
            project: Project = _read_project(legacy_id)
            image_paths: list[Path] = _read_image_paths(source_folders[folder_name])
            image_urls: list[str] = []
            next_sort_order: int = _get_next_sort_order(project.id)

            for position, image_path in enumerate(image_paths, start=1):
                import_filename: str = _create_import_filename(image_path, position)
                image_url: str = build_project_image_url(r2_config, project.id, import_filename)
                existing_image: ProjectImage | None = db.session.scalars(
                    select(ProjectImage).where(
                        ProjectImage.project_id == project.id,
                        ProjectImage.image_url == image_url,
                    )
                ).first()

                if existing_image is None:
                    with image_path.open("rb") as image_file:
                        upload_project_image(
                            config=r2_config,
                            project_id=project.id,
                            filename=import_filename,
                            content_type=IMAGE_CONTENT_TYPES[image_path.suffix.lower()],
                            file_stream=image_file,
                        )

                    db.session.add(
                        ProjectImage(
                            project_id=project.id,
                            image_url=image_url,
                            alt_text=_create_alt_text(image_path),
                            sort_order=next_sort_order,
                            created_at=utc_now(),
                        )
                    )
                    next_sort_order += 1
                    imported_images += 1
                else:
                    skipped_images += 1

                image_urls.append(image_url)

            project.cover_image_url = Random(f"{legacy_id}:{folder_name}").choice(image_urls)
            project.updated_at = utc_now()
            updated_covers += 1

        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    return ProjectImageImportSummary(
        imported_images=imported_images,
        skipped_images=skipped_images,
        updated_covers=updated_covers,
    )

from typing import Any

from app.models import Project, ProjectImage


def serialize_project_image(image: ProjectImage) -> dict[str, Any]:
    return {
        "id": image.id,
        "imageUrl": image.image_url,
        "altText": image.alt_text,
        "sortOrder": image.sort_order,
    }


def serialize_project_card(project: Project) -> dict[str, Any]:
    return {
        "id": project.id,
        "title": project.title,
        "slug": project.slug,
        "customer": project.customer,
        "contractSubject": project.contract_subject,
        "industry": project.industry,
        "territory": project.territory,
        "startYear": project.start_year,
        "endYear": project.end_year,
        "shortDescription": project.short_description,
        "coverImageUrl": project.cover_image_url,
    }


def serialize_project_detail(project: Project) -> dict[str, Any]:
    card_data: dict[str, Any] = serialize_project_card(project)
    return {
        **card_data,
        "fullDescription": project.full_description,
        "images": [serialize_project_image(image) for image in project.images],
        "createdAt": project.created_at.isoformat(),
        "updatedAt": project.updated_at.isoformat(),
    }

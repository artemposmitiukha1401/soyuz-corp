export type ProjectCard = {
  id: number;
  title: string;
  slug: string;
  customer: string;
  contractSubject: string;
  industry: string;
  territory: string;
  startYear: number;
  endYear: number;
  shortDescription: string;
  coverImageUrl: string;
};

export type ProjectImage = {
  id: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
};

export type ProjectDetail = ProjectCard & {
  fullDescription: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
};

type JsonRecord = Record<string, unknown>;

const getProjectsApiBaseUrl = (): string => {
  const apiBaseUrl: string | undefined = process.env.PROJECTS_API_BASE_URL;

  if (apiBaseUrl === undefined || apiBaseUrl.trim() === "") {
    throw new Error("Missing required environment variable: PROJECTS_API_BASE_URL");
  }

  return apiBaseUrl.replace(/\/$/, "");
};

const isRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const readString = (record: JsonRecord, key: string): string => {
  const value: unknown = record[key];

  if (typeof value !== "string") {
    throw new Error(`Invalid project API response: ${key} must be a string`);
  }

  return value;
};

const readNumber = (record: JsonRecord, key: string): number => {
  const value: unknown = record[key];

  if (typeof value !== "number") {
    throw new Error(`Invalid project API response: ${key} must be a number`);
  }

  return value;
};

const readProjectImage = (value: unknown): ProjectImage => {
  if (!isRecord(value)) {
    throw new Error("Invalid project API response: image must be an object");
  }

  return {
    id: readNumber(value, "id"),
    imageUrl: readString(value, "imageUrl"),
    altText: readString(value, "altText"),
    sortOrder: readNumber(value, "sortOrder"),
  };
};

const readProjectCard = (value: unknown): ProjectCard => {
  if (!isRecord(value)) {
    throw new Error("Invalid project API response: project must be an object");
  }

  return {
    id: readNumber(value, "id"),
    title: readString(value, "title"),
    slug: readString(value, "slug"),
    customer: readString(value, "customer"),
    contractSubject: readString(value, "contractSubject"),
    industry: readString(value, "industry"),
    territory: readString(value, "territory"),
    startYear: readNumber(value, "startYear"),
    endYear: readNumber(value, "endYear"),
    shortDescription: readString(value, "shortDescription"),
    coverImageUrl: readString(value, "coverImageUrl"),
  };
};

const readProjectDetail = (value: unknown): ProjectDetail => {
  if (!isRecord(value)) {
    throw new Error("Invalid project API response: project detail must be an object");
  }

  const images: unknown = value.images;

  if (!Array.isArray(images)) {
    throw new Error("Invalid project API response: images must be an array");
  }

  return {
    ...readProjectCard(value),
    fullDescription: readString(value, "fullDescription"),
    images: images.map(readProjectImage),
    createdAt: readString(value, "createdAt"),
    updatedAt: readString(value, "updatedAt"),
  };
};

const getJson = async (path: string): Promise<unknown> => {
  const apiBaseUrl: string = getProjectsApiBaseUrl();
  const response: Response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const responseBody: string = await response.text();
    throw new Error(
      `Project API request failed: path=${path}, status=${response.status}, body=${responseBody}`,
    );
  }

  return response.json();
};

export const getProjectImageUrl = (imageUrl: string): string => {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${getProjectsApiBaseUrl()}${imageUrl}`;
};

export const getProjects = async (): Promise<ProjectCard[]> => {
  const data: unknown = await getJson("/api/projects");

  if (!Array.isArray(data)) {
    throw new Error("Invalid project API response: projects must be an array");
  }

  return data.map(readProjectCard);
};

export const getProject = async (slug: string): Promise<ProjectDetail> => {
  const data: unknown = await getJson(`/api/projects/${slug}`);
  return readProjectDetail(data);
};

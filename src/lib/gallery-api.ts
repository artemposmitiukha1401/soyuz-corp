export type GalleryImage = {
  key: string;
  url: string;
  altText: string;
};

type JsonRecord = Record<string, unknown>;

const getApiBaseUrl = (): string => {
  const apiBaseUrl: string | undefined = process.env.PROJECTS_API_BASE_URL;

  if (apiBaseUrl === undefined || apiBaseUrl.trim() === "") {
    throw new Error("Missing required environment variable: PROJECTS_API_BASE_URL");
  }

  return apiBaseUrl.replace(/\/$/, "");
};

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (record: JsonRecord, key: string): string => {
  const value: unknown = record[key];

  if (typeof value !== "string") {
    throw new Error(`Invalid gallery API response: ${key} must be a string`);
  }

  return value;
};

const readGalleryImage = (value: unknown): GalleryImage => {
  if (!isRecord(value)) {
    throw new Error("Invalid gallery API response: image must be an object");
  }

  return {
    key: readString(value, "key"),
    url: readString(value, "url"),
    altText: readString(value, "altText"),
  };
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const response: Response = await fetch(`${getApiBaseUrl()}/api/gallery`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const responseBody: string = await response.text();
    throw new Error(
      `Gallery API request failed: status=${response.status}, body=${responseBody}`,
    );
  }

  const data: unknown = await response.json();

  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new Error("Invalid gallery API response: items must be an array");
  }

  return data.items.map(readGalleryImage);
};

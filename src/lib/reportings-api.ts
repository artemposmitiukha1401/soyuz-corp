export type ReportingDocument = {
  id: number;
  label: string;
  fileUrl: string;
};

export type Reporting = {
  id: number;
  year: number;
  documents: ReportingDocument[];
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

const readNumber = (record: JsonRecord, key: string): number => {
  const value: unknown = record[key];

  if (typeof value !== "number") {
    throw new Error(`Invalid reporting API response: ${key} must be a number`);
  }

  return value;
};

const readString = (record: JsonRecord, key: string): string => {
  const value: unknown = record[key];

  if (typeof value !== "string") {
    throw new Error(`Invalid reporting API response: ${key} must be a string`);
  }

  return value;
};

const readReportingDocument = (value: unknown): ReportingDocument => {
  if (!isRecord(value)) {
    throw new Error("Invalid reporting API response: document must be an object");
  }

  return {
    id: readNumber(value, "id"),
    label: readString(value, "label"),
    fileUrl: readString(value, "fileUrl"),
  };
};

const readReporting = (value: unknown): Reporting => {
  if (!isRecord(value)) {
    throw new Error("Invalid reporting API response: reporting must be an object");
  }

  const documents: unknown = value.documents;

  if (!Array.isArray(documents)) {
    throw new Error("Invalid reporting API response: documents must be an array");
  }

  return {
    id: readNumber(value, "id"),
    year: readNumber(value, "year"),
    documents: documents.map(readReportingDocument),
  };
};

export const getReportings = async (): Promise<Reporting[]> => {
  const response: Response = await fetch(`${getApiBaseUrl()}/api/reportings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const responseBody: string = await response.text();
    throw new Error(
      `Reporting API request failed: status=${response.status}, body=${responseBody}`,
    );
  }

  const data: unknown = await response.json();

  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new Error("Invalid reporting API response: items must be an array");
  }

  return data.items.map(readReporting);
};

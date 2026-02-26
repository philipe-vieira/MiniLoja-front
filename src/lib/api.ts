import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
const normalizedBaseUrl = apiBaseUrl.endsWith("/")
  ? apiBaseUrl.slice(0, -1)
  : apiBaseUrl;

export const api = axios.create({
  baseURL: normalizedBaseUrl,
});

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallbackMessage;
}


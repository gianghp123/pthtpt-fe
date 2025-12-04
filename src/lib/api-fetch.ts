import { ServerResponseModel } from './typedefs/server-response';

type ApiFetchOptions = {
  baseUrl?: string;
  withCredentials?: boolean;
  transformCase?: boolean;
  query?: Record<string, any>;
} & RequestInit;

export async function apiFetch<T = any>(
  url: string,
  options?: ApiFetchOptions
): Promise<ServerResponseModel<T>> {

  try {
    const {
      withCredentials = false,
      transformCase = true,
      baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL,
      query,
      ...fetchOptions
    } = options || {};

    if (!baseUrl) {
      throw new Error('Server API_URL is not configured. Please set API_URL environment variable.');
    }

    const headers: Record<string, any> = {
      ...fetchOptions?.headers,
    };


    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";

    // 🧩 Transform query to snake_case
    let queryString = "";
    if (query && Object.keys(query).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          (Array.isArray(value) ? value.length > 0 : true)
        ) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v))); // append each element separately
          } else {
            searchParams.append(key, String(value));
          }
        }
      });

      queryString = `?${searchParams.toString()}`;
    }

    const fullUrl = `${baseUrl}${url}${queryString}`;


    const response = await fetch(fullUrl, { ...fetchOptions, headers });
    if (!response.ok) {
      let message = "Unknown error";
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_) {}
      return { success: false, statusCode: response.status, message };
    }

    const data = await response.json();

    return {
      success: true,
      statusCode: response.status,
      data: data.data ? (data.data as T) : (data as T),
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      statusCode: 500,
      message: error.message || "Unknown error",
    };
  }
}
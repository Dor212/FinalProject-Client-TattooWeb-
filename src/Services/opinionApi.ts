import axios, { AxiosError } from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

export type Opinion = {
  _id: string;
  firstName: string;
  rating: number;
  text?: string;
  imageUrl: string;
  createdAt: string;
};

type ApiErrorBody = {
  message?: string;
  error?: string;
};

function is404(err: unknown) {
  const e = err as AxiosError;
  return !!e?.response && e.response.status === 404;
}

async function getWithFallback<T>(pathA: string, pathB: string): Promise<T> {
  try {
    const { data } = await axios.get<T>(`${VITE_API_URL}${pathA}`);
    return data;
  } catch (err) {
    if (is404(err)) {
      const { data } = await axios.get<T>(`${VITE_API_URL}${pathB}`);
      return data;
    }
    throw err;
  }
}

async function postFormWithFallback<T>(pathA: string, pathB: string, fd: FormData): Promise<T> {
  try {
    const { data } = await axios.post<T>(`${VITE_API_URL}${pathA}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    if (is404(err)) {
      const { data } = await axios.post<T>(`${VITE_API_URL}${pathB}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
    throw err;
  }
}

async function deleteWithFallback<T>(
  paths: string[],
  token: string
): Promise<T> {
  let lastErr: unknown = null;

  for (const p of paths) {
    try {
      const { data } = await axios.delete<T>(`${VITE_API_URL}${p}`, {
        headers: { "x-auth-token": token },
      });
      return data;
    } catch (err) {
      lastErr = err;
      if (!is404(err)) throw err;
    }
  }

  throw lastErr;
}

export async function getOpinions(limit = 24): Promise<Opinion[]> {
  const a = `/opinion?limit=${limit}`;
  const b = `/api/opinion?limit=${limit}`;
  return getWithFallback<Opinion[]>(a, b);
}

export async function createOpinion(payload: {
  firstName: string;
  rating: number;
  text?: string;
  consent: boolean;
  image: File;
}): Promise<Opinion> {
  const fd = new FormData();
  fd.append("firstName", payload.firstName);
  fd.append("rating", String(payload.rating));
  fd.append("text", payload.text || "");
  fd.append("consent", String(payload.consent));
  fd.append("image", payload.image);
  fd.append("website", "");

  return postFormWithFallback<Opinion>(`/opinion`, `/api/opinion`, fd);
}

export async function deleteOpinion(opinionId: string, token: string): Promise<{ ok?: boolean; id?: string }> {
  const id = encodeURIComponent(opinionId);

  const paths = [
    `/api/opinions/${id}`,
    `/opinions/${id}`,
    `/api/opinion/${id}`,
    `/opinion/${id}`,
  ];

  return deleteWithFallback<{ ok?: boolean; id?: string }>(paths, token);
}

export function getOpinionErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "משהו השתבש. נסה שוב."
    );
  }
  return "משהו השתבש. נסה שוב.";
}

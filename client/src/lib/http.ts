import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & { baseUrl?: string };

class HttpError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

class SesstionToken {
  private token = "";

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Không thể gọi hàm này ở phía server");
    }
    this.token = token;
  }

  get value() {
    return this.token;
  }
}

export const clientSesstionToken = new SesstionToken();

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: clientSesstionToken.value ? `Bearer ${clientSesstionToken.value}` : "",
  };

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến NextJS server
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

  // /account/me
  // account/me

  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await res.json();
  const data = { status: res.status, payload };
  if (!res.ok) {
    throw new HttpError(data);
  }

  if (["/auth/login", "/auth/register"].includes(url)) {
    clientSesstionToken.value = (payload as LoginResType).data.token;
  } else if ("/auth/logout".includes(url)) {
    clientSesstionToken.value = "";
  }
  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("GET", url, options);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("POST", url, { ...options, body });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("PUT", url, { ...options, body });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;

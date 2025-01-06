import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { normalizePath } from "./utils";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & { baseUrl?: string };

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: { field: string; message: string }[];
};
export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";

  get value() {
    return this.token;
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Không thể gọi hàm này ở phía server");
    }
    this.token = token;
  }
}

export const clientSessionToken = new SessionToken();

let clientLogoutRequest: null | Promise<any> = null;
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : "",
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
  // Intercept là nơi chúng ta xử lý request và response trước khi nó được trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            },
          });
          await clientLogoutRequest;
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !");
          clientSessionToken.value = "";
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        const sessionToken = (options?.headers as any)?.Authorization.split("Bearer ")[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // Đảm bảo logic này chỉ chạy ở phía client (browser)
  if (typeof window !== "undefined") {
    if (["/auth/login", "/auth/register"].some((item) => item === normalizePath(url))) {
      clientSessionToken.value = (payload as LoginResType).data.token;
    } else if ("/auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
    }
  }
  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("GET", url, options);
  },

  post<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("PUT", url, { ...options, body });
  },

  delete<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
